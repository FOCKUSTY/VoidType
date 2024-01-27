let
  globalMusicPlaying = new Map(),
  localMusic: any;

const setGMPlaying = async (arg: any, boolean=false) =>
{
  if(globalMusicPlaying.size===0 && arg.guilds.cache) await arg.guilds.cache.forEach((guild: any) =>
    {
      globalMusicPlaying.set(guild, boolean);
    })
  else globalMusicPlaying.set(arg, boolean);
};

const getGMPlaying = (guildName: string) =>
{
  return globalMusicPlaying.get(guildName)
};

const setMusic = (music: any) =>
{
  localMusic = music
};

const getMusic = () =>
{
  return localMusic
};

export
{
  setGMPlaying,
  getGMPlaying,
  setMusic,
  getMusic
};