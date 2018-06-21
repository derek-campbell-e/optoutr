module.exports = function Profiles(OptOutr){
  const oo = OptOutr;
  const path = require('path');
  const fs = require('fs');
  const basedir = path.join(__dirname, '..', '..');
  const profilesFile = path.join(basedir, 'profiles.json');
  const UUID = function(){
    const crypto = require('crypto');
    return crypto.randomBytes(4).toString('hex') + '-' + crypto.randomBytes(8).toString('hex');
  };

  let profiles = {};
  let uniformJSON = function(json, fallback){
    fallback = fallback || {};
    let string = "";
    try {
      string = JSON.stringify(json, null, 2);
    } catch (error){
      string = JSON.stringify(fallback, null, 2);
    }
    return string;
  };

  profiles.data = {};

  profiles.load = function(error){
    let req = {};
    try {
      delete require.cache[require.resolve(profilesFile)];
      req = require(profilesFile);
    } catch (reqError){
      if(error){
        throw error;
      }
      return profiles.createFile(profiles.load);
    }
    profiles.data = req;
  };

  profiles.createFile = function(callback){
    let json = {};
    let string = uniformJSON(json);
    fs.writeFile(profilesFile, string, function(error){
      callback(error);
    });
  };

  profiles.createProfile = function(person, callback){
    let id = person.UUID || UUID();
    let fullName = `${person.firstName} ${person.lastName}`;
    person.fullName = fullName;
    person.UUID = id;
    profiles.data[id] = person;
    profiles.saveProfiles(callback);
  };

  profiles.saveProfiles = function(callback){
    let json = profiles.data;
    let string = uniformJSON(json);
    fs.writeFile(profilesFile, string, function(error){
      callback(error);
    });
  };

  profiles.refresh = function(){
    profiles.load();
    return profiles.export();
  };

  profiles.export = function(){
    let exports = {};
    for(let key in profiles.data){
      exports[key] = profiles.data[key];
    }
    return exports;
  };

  let init = function(){
    profiles.load();
    return profiles;
  };

  return init();
};