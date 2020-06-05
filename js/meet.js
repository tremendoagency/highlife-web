/* global $, JitsiMeetJS */

var config = {
  // Connection
    //

    hosts: {
      // XMPP domain.
      domain: 'jitsi-meet.example.com',

      // XMPP MUC domain. FIXME: use XEP-0030 to discover it.
      muc: 'conference.jitsi-meet.example.com'
  },

  // BOSH URL. FIXME: use XEP-0156 to discover it.
  bosh: '//jitsi-meet.example.com/http-bind',
  //bosh: "/meet.jit.si/http-bind", // FIXME: use xep-0156 for that
  //bosh: '//beta.meet.jit.si/http-bind', // FIXME: use xep-0156 for that



  // The name of client node advertised in XEP-0115 'c' stanza
  clientNode: 'http://jitsi.org/jitsimeet',

  disableSimulcast: false,
  enableRemb: false,
  enableTcc: true,
  resolution: 720,
  constraints: {
    video: {
      aspectRatio: 16 / 9,
      height: {
        ideal: 720,
        max: 720,
        min: 180
      },
      width: {
        ideal: 1280,
        max: 1280,
        min: 320
      }
    }
  },
  externalConnectUrl: '//beta.meet.jit.si/http-pre-bind',
  p2pStunServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" }
  ],
  enableP2P: true, // flag to control P2P connections
  p2p: {
    enabled: true,
    preferH264: true,
    disableH264: true,
    useStunTurn: true, // use XEP-0215 to fetch STUN and TURN server for the P2P connection
    stunServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      { urls: "stun:stun2.l.google.com:19302" }
    ]
  },
  useStunTurn: true, // use XEP-0215 to fetch STUN and TURN server for the JVB connection
  useIPv6: false, // ipv6 support. use at your own risk
  useNicks: false,
  openBridgeChannel: 'websocket', // One of true, 'datachannel', or 'websocket'
  channelLastN: -1, // The default value of the channel attribute last-n.
  minHDHeight: 540,
  startBitrate: "800",
  useRtcpMux: true,
  useBundle: true,
  disableSuspendVideo: true,
  stereo: false,
  forceJVB121Ratio: -1,
  enableTalkWhileMuted: true,
  enableClosePage: true,
};

let connection = null;
let isJoined = false;
let room = null;

let localTracks = [];
const remoteTracks = {};

/**
 * Handles local tracks.
 * @param tracks Array with JitsiTrack objects
 */
function onLocalTracks(tracks) {
  localTracks = tracks;
  for (let i = 0; i < localTracks.length; i++) {
    // localTracks[i].addEventListener(
    //     JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED,
    //     audioLevel => console.log(`Audio Level local: ${audioLevel}`));
    localTracks[i].addEventListener(
      JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
      () => console.log('local track muted'));
    localTracks[i].addEventListener(
      JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED,
      () => console.log('local track stoped'));
    localTracks[i].addEventListener(
      JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
      deviceId =>
        console.log(
          `track audio output device was changed to ${deviceId}`));
    if (localTracks[i].getType() === 'video') {
      $('body').append(`<video autoplay='1' id='localVideo${i}' />`);
      localTracks[i].attach($(`#localVideo${i}`)[0]);
    } else {
      $('body').append(
        `<audio autoplay='1' muted='true' id='localAudio${i}' />`);
      localTracks[i].attach($(`#localAudio${i}`)[0]);
    }
    if (isJoined) {
      room.addTrack(localTracks[i]);
    }
  }
}

/**
 * Handles remote tracks
 * @param track JitsiTrack object
 */
function onRemoteTrack(track) {
  if (track.isLocal()) {
    return;
  }
  const participant = track.getParticipantId();

  if (!remoteTracks[participant]) {
    remoteTracks[participant] = [];
  }
  const idx = remoteTracks[participant].push(track);

  track.addEventListener(
    JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED,
    audioLevel => console.log(`Audio Level remote: ${audioLevel}`));
  track.addEventListener(
    JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
    () => console.log('remote track muted'));
  track.addEventListener(
    JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED,
    () => console.log('remote track stoped'));
  track.addEventListener(JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
    deviceId =>
      console.log(
        `track audio output device was changed to ${deviceId}`));
  const id = participant + track.getType() + idx;

  if (track.getType() === 'video') {
    $('body').append(
      `<video autoplay='1' id='${participant}video${idx}' />`);
  } else {
    $('body').append(
      `<audio autoplay='1' id='${participant}audio${idx}' />`);
  }
  track.attach($(`#${id}`)[0]);
}

/**
 * That function is executed when the conference is joined
 */
function onConferenceJoined() {
  console.log('conference joined!');
  isJoined = true;
  for (let i = 0; i < localTracks.length; i++) {
    room.addTrack(localTracks[i]);
  }
}

/**
 *
 * @param id
 */
function onUserLeft(id) {
  console.log('user left');
  if (!remoteTracks[id]) {
    return;
  }
  const tracks = remoteTracks[id];

  for (let i = 0; i < tracks.length; i++) {
    tracks[i].detach($(`#${id}${tracks[i].getType()}`));
  }
}

/**
 * That function is called when connection is established successfully
 */
function onConnectionSuccess() {
  room = connection.initJitsiConference('conferenceqqq', config);
  room.on(JitsiMeetJS.events.conference.TRACK_ADDED, onRemoteTrack);
  room.on(JitsiMeetJS.events.conference.TRACK_REMOVED, track => {
    console.log(`track removed!!!${track}`);
  });
  room.on(
    JitsiMeetJS.events.conference.CONFERENCE_JOINED,
    onConferenceJoined);
  room.on(JitsiMeetJS.events.conference.USER_JOINED, id => {
    console.log('user join');
    remoteTracks[id] = [];
  });
  room.on(JitsiMeetJS.events.conference.USER_LEFT, onUserLeft);
  room.on(JitsiMeetJS.events.conference.TRACK_MUTE_CHANGED, track => {
    console.log(`${track.getType()} - ${track.isMuted()}`);
  });
  room.on(
    JitsiMeetJS.events.conference.DISPLAY_NAME_CHANGED,
    (userID, displayName) => console.log(`${userID} - ${displayName}`));
  room.on(
    JitsiMeetJS.events.conference.TRACK_AUDIO_LEVEL_CHANGED,
    (userID, audioLevel) => console.log(`${userID} - ${audioLevel}`));
  room.on(
    JitsiMeetJS.events.conference.PHONE_NUMBER_CHANGED,
    () => console.log(`${room.getPhoneNumber()} - ${room.getPhonePin()}`));
  room.join();
}

/**
 * This function is called when the connection fail.
 */
function onConnectionFailed() {
  console.error('Connection Failed!');
}

/**
 * This function is called when the connection fail.
 */
function onDeviceListChanged(devices) {
  console.info('current devices', devices);
}

/**
 * This function is called when we disconnect.
 */
function disconnect() {
  console.log('disconnect!');
  connection.removeEventListener(
    JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
    onConnectionSuccess);
  connection.removeEventListener(
    JitsiMeetJS.events.connection.CONNECTION_FAILED,
    onConnectionFailed);
  connection.removeEventListener(
    JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
    disconnect);
}

/**
 *
 */
function unload() {
  for (let i = 0; i < localTracks.length; i++) {
    localTracks[i].dispose();
  }
  room.leave();
  connection.disconnect();
}

let isVideo = true;

/**
 *
 */
function switchVideo() { // eslint-disable-line no-unused-vars
  isVideo = !isVideo;
  if (localTracks[1]) {
    localTracks[1].dispose();
    localTracks.pop();
  }
  JitsiMeetJS.createLocalTracks({
    devices: [isVideo ? 'video' : 'desktop']
  })
    .then(tracks => {
      localTracks.push(tracks[0]);
      localTracks[1].addEventListener(
        JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
        () => console.log('local track muted'));
      localTracks[1].addEventListener(
        JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED,
        () => console.log('local track stoped'));
      localTracks[1].attach($('#localVideo1')[0]);
      room.addTrack(localTracks[1]);
    })
    .catch(error => console.log(error));
}

/**
 *
 * @param selected
 */
function changeAudioOutput(selected) { // eslint-disable-line no-unused-vars
  JitsiMeetJS.mediaDevices.setAudioOutputDevice(selected.value);
}

$(window).bind('beforeunload', unload);
$(window).bind('unload', unload);

// JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.LOG);

JitsiMeetJS.init(config);

connection = new JitsiMeetJS.JitsiConnection(null, null, config);

connection.addEventListener(
  JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
  onConnectionSuccess);
connection.addEventListener(
  JitsiMeetJS.events.connection.CONNECTION_FAILED,
  onConnectionFailed);
connection.addEventListener(
  JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
  disconnect);

JitsiMeetJS.mediaDevices.addEventListener(
  JitsiMeetJS.events.mediaDevices.DEVICE_LIST_CHANGED,
  onDeviceListChanged);

connection.connect();
