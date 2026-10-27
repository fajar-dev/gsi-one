import { ActionButton } from '../../components/ui/ActionButton';
import { palette, touchTarget, spacing, radius } from '../../theme/tokens';
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Image, Text, ActivityIndicator } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { scale, fontScale, SCREEN_WIDTH } from '../../utils/responsive';

const VIDEO_HEIGHT = scale(220);
const VIDEO_WIDTH = SCREEN_WIDTH - scale(32);
const YOUTUBE_VIDEO_ID = '25jniAeR5RM';

const THUMBNAIL_URL = `https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/hqdefault.jpg`;

function VideoSection(): React.ReactElement {
  const [isPlayerLoaded, setIsPlayerLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);

  const onStateChange = useCallback((state: string) => {
    if (state === 'ended') setPlaying(false);
    if (state === 'buffering') setIsBuffering(true);
    if (state === 'playing') setIsBuffering(false);
  }, []);

  const handlePlayPress = () => {
    setIsPlayerLoaded(true);
    setPlaying(true);
  };

  return (
    <View style={styles.container}>
      {!isPlayerLoaded ? (
        <ActionButton
          style={[styles.thumbnailWrapper, { height: VIDEO_HEIGHT }]}
          onPress={handlePlayPress}
          activeOpacity={0.9}
          accessibilityRole="button"
        >
          <Image
            source={{ uri: THUMBNAIL_URL }}
            style={styles.thumbnail}
            resizeMode="cover"
          />

          <View style={styles.overlay} />

          <View style={styles.playButton}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
        </ActionButton>
      ) : (
        <View style={{ height: VIDEO_HEIGHT }}>
          <YoutubePlayer
            height={VIDEO_HEIGHT}
            width={VIDEO_WIDTH}
            play={playing}
            videoId={YOUTUBE_VIDEO_ID}
            onChangeState={onStateChange}
            webViewProps={{
              allowsInlineMediaPlayback: true,
              mediaPlaybackRequiresUserAction: false,
            }}
            initialPlayerParams={{
              controls: true,
              modestbranding: true,
              rel: false,
              loop: true,
            }}
          />

          {isBuffering && (
            <View style={styles.bufferingOverlay}>
              <ActivityIndicator color={palette.white} size="large" />
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.black,
    marginHorizontal: scale(spacing.lg),
    marginVertical: scale(spacing.md),
    borderRadius: scale(radius.lg),
    overflow: 'hidden',
    elevation: 3,
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  thumbnailWrapper: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  playButton: {
    minHeight: touchTarget.minSize,
    minWidth: touchTarget.minSize,
    width: scale(64),
    height: scale(64),
    borderRadius: scale(32),
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  playIcon: {
    fontSize: fontScale(26),
    color: '#FF0000',
    marginLeft: scale(spacing.xs),
  },
  bufferingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
});

export default VideoSection;
