export MIX_ENV=prod
export PORT=4796

echo "Stopping old copy of app, if any..."

_build/prod/rel/tasktrack3/bin/tasktrack3 stop || true

echo "Starting app..."

# Foreground for testing and for systemd
_build/prod/rel/tasktrack3/bin/tasktrack3 foreground