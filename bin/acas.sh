#!/bin/sh
# chkconfig: 2345 64 02
# description: start and stop the acas app.js, server.js and apache instance
# processname: acas

################################################################################
################################################################################
##                                                                            ##
#                       PATHs section                                          #
##                                                                            ##
################################################################################
################################################################################
 
#macs don't have /etc/init.d/functions so skipping.
unamestr=$(uname)
if [ "$unamestr" != 'Darwin' ]; then
	. /etc/init.d/functions
fi

export PATH=/usr/local/bin:${PATH:=}
export MANPATH=/usr/local/man:${MANPATH:=}
export LD_LIBRARY_PATH=/usr/local/lib:${LD_LIBRARY_PATH:=}
 
 
################################################################################
################################################################################
##                                                                            ##
#                       FOREVER section                                        #
##                                                                            ##
################################################################################
################################################################################
 
 
running() {
	forever list 2>/dev/null | grep ${APP} 2>&1 >/dev/null
    return $?
}
 
start_server() {
	cd `dirname ${APP}`
	startCommand="forever start --append -l $logname -o $logout -e $logerr ${APP} 2>&1 >/dev/null"
	if [ $(whoami) != $ACAS_USER ]; then
		startCommand="su - $ACAS_USER $suAdd -c \"($startCommand)\""
	fi
	eval $startCommand
	return $?
}
 
stop_server() {
	forever stop ${APP} 2>&1 >/dev/null
	return $?
}

apache_running() {
	pidofproc -p $ACAS_HOME/bin/apache.pid 2>&1 >/dev/null
	return $?
	#[ `pgrep $pid` ] && echo 'running' || echo 'running'
}

start_apache() {
	/usr/sbin/httpd -f $ACAS_HOME/conf/$apacheConfFile -k start 2>&1 >/dev/null
	return $?
}

stop_apache() {
	/usr/sbin/httpd -f $ACAS_HOME/conf/$apacheConfFile -k stop 2>&1 >/dev/null
	return $?
}

apache_reload() {
	/usr/sbin/httpd -f $ACAS_HOME/conf/$apacheConfFile -k graceful 2>&1 >/dev/null
	return $?
}
 
################################################################################
################################################################################
##                                                                            ##
#                       GENERIC section                                        #
##                                                                            ##
################################################################################
################################################################################

DIETIME=10              # Time to wait for the server to die, in seconds
                        # If this value is set too low you might not
                        # let some servers to die gracefully and
                        # 'restart' will not work
 
STARTTIME=2             # Time to wait for the server to start, in seconds
                        # If this value is set each time the server is
                        # started (on start or restart) the script will
                        # stall to try to determine if it is running
                        # If it is not set and the server takes time
                        # to setup a pid file the log message might
                        # be a false positive (says it did not start
                        # when it actually did)
 
# Console logging.
log() {
  local STRING mode
 
  STRING=$1
  arg2=$2
  mode="${arg2:=success}"
  
  echo -n "$STRING "
  if [ "${RHGB_STARTED:-}" != "" -a -w /etc/rhgb/temp/rhgb-console ]; then
    echo -n "$STRING " > /etc/rhgb/temp/rhgb-console
  fi
  if [ "$mode" = "success" ]; then
    success $"$STRING"
  else
    failure $"$STRING"
  fi
  echo
  if [ "${RHGB_STARTED:-}" != "" -a -w /etc/rhgb/temp/rhgb-console ]; then
    if [ "$mode" = "success" ]; then
      echo_success > /etc/rhgb/temp/rhgb-console
    else
      echo_failure > /etc/rhgb/temp/rhgb-console
      [ -x /usr/bin/rhgb-client ] && /usr/bin/rhgb-client --details=yes
    fi
    echo > /etc/rhgb/temp/rhgb-console
  fi
}
 
# Starts the server.
do_start() {
  for dir in `find $ACAS_HOME/.. -maxdepth 1 -type l`
	do
		if [ -e $dir/app.js ]; then
			app=app.js
		fi
		if [ -e $dir/server.js ]; then
			app=server.js
		fi
		dirname=`basename $dir`
		NAME=$app
		APP=$(readlink -f $dir)/$app
		LOCKFILE=$ACAS_HOME/bin/$app.LOCKFILE
		logname=$server_log_path/${dirname}${server_log_suffix}.log
		logout=$server_log_path/${dirname}${server_log_suffix}_stdout.log
		logerr=$server_log_path/${dirname}${server_log_suffix}_stderr.log
	  # Check if it's running first
	  if running ;  then
		log "$NAME already running"
	  else 
		  action "Starting $NAME" start_server
		  RETVAL=$?
		  if [ $RETVAL -eq 0 ]; then
			# NOTE: Some servers might die some time after they start,
			# this code will detect this issue if STARTTIME is set
			# to a reasonable value
			[ -n "$STARTTIME" ] && sleep $STARTTIME # Wait some time
			if  running ;  then
			  # It's ok, the server started and is running
			  log "$NAME started"
			  touch $LOCKFILE
			  RETVAL=0
			else
			  # It is not running after we did start
			  log "$NAME died on startup" "failure"
			  RETVAL=1
			fi
	  fi

	  fi
	done
	if apache_running ;  then
		log "apache already running"
	else
		action "Starting apache" start_apache
		RETVAL=$?
		if [ $RETVAL -eq 0 ]; then
			log "apache started"
		else
			log "apache startup failure" "failure"
			RETVAL=1
		fi
	fi
  	return $RETVAL
}
 
# Stops the server.
do_stop() {
	for dir in `find $ACAS_HOME/.. -maxdepth 1 -type l`
	do
		if [ -e $dir/app.js ]; then
			app=app.js
		fi
		if [ -e $dir/server.js ]; then
			app=server.js
		fi
		dirname=`basename $dir`
		NAME=$app
		LOCKFILE=$ACAS_HOME/bin/$app.LOCKFILE
		APP=$(readlink -f $dir)/$app
	  if running ; then
		# Only stop the server if we see it running
		action "Stopping $NAME" stop_server
		RETVAL=$?
		[ $RETVAL -eq 0 ] && rm -f $LOCKFILE
	  else
		# If it's not running don't do anything
		log "$NAME not running"
		RETVAL=0
	  fi
	done
	if apache_running ;  then
		action "Stopping apache" stop_apache
		RETVAL=$?
	else
		# If it's not running don't do anything
		log "apache not running"
		RETVAL=0
	fi
  return $RETVAL
}

get_status() {
	for dir in `find $ACAS_HOME/.. -maxdepth 1 -type l`
	do
		if [ -e $dir/app.js ]; then
			app=app.js
		fi
		if [ -e $dir/server.js ]; then
			app=server.js
		fi
		dirname=`basename $dir`
		NAME=$app
		APP=$(readlink -f $dir)/$app
		if running ;  then
		  log "$NAME running"
		else
		  log "$NAME not running"
		fi
	done
	if apache_running ;  then
	  log "apache running"
	else
	  log "apache not running"
	fi
}

################################################################################
################################################################################
##                                                                            ##
#                           APPLICATION section                                #
##             Edit the variables below for your installation                 ##
################################################################################
################################################################################
 
scriptPath=${BASH_SOURCE[0]}
if [ "$scriptPath" == '' ]; then
	scriptPath=$(readlink ${BASH_SOURCE[0]})
fi
ACAS_HOME=$(cd "$(dirname "$scriptPath")"/..; pwd)
#Get ACAS config variables
source /dev/stdin <<< "$(cat $ACAS_HOME/conf/compiled/conf.properties | awk -f $ACAS_HOME/conf/readproperties.awk)"

#Export these variables so that the apache config can pick them up
export ACAS_USER=${server_run_user}
if [ "$ACAS_USER" == "" ] || [ "$ACAS_USER" == "null" ]; then
    #echo "Setting ACAS_USER to $(whoami)"
    export ACAS_USER=$(whoami)
fi

export ACAS_GROUP=$(id -g -n $ACAS_USER)
export ACAS_HOME=$ACAS_HOME
export client_service_rapache_port=$client_service_rapache_port
export client_service_rapache_path=$client_service_rapache_path
export client_host=$client_host
export client_port=$client_port
export server_log_path=$server_log_path
export server_log_suffix=$server_log_suffix
export server_log_level=$(echo $server_log_level | awk '{print tolower($0)}')

unamestr=$(uname)
apacheConfFile=apache.conf
if [ "$unamestr" == 'Darwin' ]; then
	suAdd="-i"
	apacheConfFile=apache-darwin.conf
fi

case "$1" in
  start)
	do_start
	RETVAL=$?
	;;
  stop)
	do_stop
	RETVAL=$?
	;;
  restart)
	do_stop
	RETVAL=$?
	if [ $RETVAL -eq 0 ]; then
	  # Wait some sensible amount, some server need this
	  [ -n "$DIETIME" ] && sleep $DIETIME
	  do_start
	  RETVAL=$?
	fi
	;;
  status)
	get_status
	RETVAL=0
	;;
  reload)
	if apache_running; then
		action "reloading apache" apache_reload
		RETVAL=$?
		if [ $RETVAL -eq 0 ]; then
			log "apache reloaded"
		else
			log "apache reload failure" "failure"
			RETVAL=1
		fi
	else 
		log "apache is not running" "failure"
		REVAL=0
	fi
	RETVAL=$RETVAL
	;;
  *)
	echo "Usage: ${0} {start|stop|status|restart|reload}"
	RETVAL=1
	;;
esac
exit $RETVAL