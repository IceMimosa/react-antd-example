

export function convertToDockerSetting(setting) {
  const { env, ports, logDir, extraHosts, volumes, logConfig, logOpt } = setting;
  const result = { logDir };
  if (env && env !== '') {
    const Env = _.filter(env.split('\n'), t => t !== '');
    if (Env.length > 0) {
      _.set(result, 'configuration.Config.Env', Env);
    }
  }
  if (extraHosts && extraHosts !== '') {
    const ExtHosts = _.filter(extraHosts.split('\n'), t => t !== '');
    if (ExtHosts.length > 0) {
      _.set(result, 'configuration.HostConfig.ExtraHosts', ExtHosts);
    }
  }
  if (ports && ports !== '') {
    const Ports = _.filter(ports.split('\n'), t => t !== '');
    if (Ports.length > 0) {
      result.ports = Ports;
    }
  }
  if (volumes && volumes !== '') {
    const Volumes = _.filter(volumes.split('\n'), t => t !== '');
    if (Volumes.length > 0) {
      _.set(result, 'configuration.HostConfig.Binds', Volumes);
    }
  }
  if (logConfig && logConfig !== '') {
    _.set(result, 'configuration.HostConfig.LogConfig.Type', logConfig);
  }
  if (logOpt) {
    _.set(result, 'configuration.HostConfig.LogConfig.Config', logOpt);
  }
  return result;
}

export function convertToSetting(setting) {
  let env = _.get(setting, 'configuration.Config.Env');
  if (env) {
    env = env.join('\n');
  }
  let extraHosts = _.get(setting, 'configuration.HostConfig.ExtraHosts');
  if (extraHosts) {
    extraHosts = extraHosts.join('\n');
  }
  let ports = setting.ports;
  if (_.isArray(ports)) {
    ports = ports.join('\n');
  }
  let volumes = _.get(setting, 'configuration.HostConfig.Binds');
  if (_.isArray(volumes)) {
    volumes = volumes.join('\n');
  }
  const logConfig = _.get(setting, 'configuration.HostConfig.LogConfig');
  return { env, extraHosts, ports, logDir: setting.logDir, volumes, logConfig };
}
