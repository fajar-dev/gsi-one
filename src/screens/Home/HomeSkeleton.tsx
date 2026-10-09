import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale } from '../../utils/responsive';
import SkeletonBox from '../../components/common/SkeletonBox';

const HomeSkeleton = () => {
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#002239', '#0F9F67']}
                style={[
                    styles.headerContainer,
                    { paddingTop: insets.top > 0 ? insets.top + scale(12) : scale(16) }
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.topRow}>
                    <View style={styles.brandContainer}>
                        <SkeletonBox
                            width={scale(38)}
                            height={scale(38)}
                            borderRadius={scale(19)}
                            style={styles.whiteLightSkeleton}
                        />
                        <SkeletonBox
                            width={scale(80)}
                            height={scale(18)}
                            borderRadius={scale(4)}
                            style={[styles.whiteLightSkeleton, { marginLeft: scale(10) }]}
                        />
                    </View>
                    <View style={styles.actionContainer}>
                        <SkeletonBox
                            width={scale(30)}
                            height={scale(30)}
                            borderRadius={scale(15)}
                            style={[styles.whiteLightSkeleton, { marginRight: scale(8) }]}
                        />
                        <SkeletonBox
                            width={scale(30)}
                            height={scale(30)}
                            borderRadius={scale(15)}
                            style={[styles.whiteLightSkeleton, { marginRight: scale(8) }]}
                        />
                        <SkeletonBox
                            width={scale(60)}
                            height={scale(26)}
                            borderRadius={scale(10)}
                            style={styles.whiteLightSkeleton}
                        />
                    </View>
                </View>

                <View style={styles.greetingSection}>
                    <SkeletonBox
                        width="65%"
                        height={scale(22)}
                        borderRadius={scale(6)}
                        style={styles.whiteLightSkeleton}
                    />
                    <SkeletonBox
                        width="45%"
                        height={scale(22)}
                        borderRadius={scale(6)}
                        style={[styles.whiteLightSkeleton, { marginTop: scale(6) }]}
                    />
                    <SkeletonBox
                        width="80%"
                        height={scale(12)}
                        borderRadius={scale(4)}
                        style={[styles.whiteLightSkeletonSub, { marginTop: scale(12) }]}
                    />
                </View>
            </LinearGradient>

            <View style={styles.heroWrapper}>
                <View style={styles.heroCard}>
                    <View style={styles.heroLeftCol}>
                        <SkeletonBox width="90%" height={scale(16)} borderRadius={scale(4)} />
                        <SkeletonBox width="75%" height={scale(16)} borderRadius={scale(4)} style={styles.mt6} />
                        <SkeletonBox width="85%" height={scale(10)} borderRadius={scale(3)} style={styles.mt8} />
                        <SkeletonBox width={scale(115)} height={scale(32)} borderRadius={scale(10)} style={styles.mt14} />
                        <SkeletonBox width={scale(80)} height={scale(12)} borderRadius={scale(3)} style={styles.mt12} />
                    </View>
                    <View style={styles.heroRightCol}>
                        <SkeletonBox width={scale(105)} height={scale(130)} borderRadius={scale(16)} />
                    </View>
                </View>
            </View>

            <View style={styles.sectionContainer}>
                <SkeletonBox width={scale(120)} height={scale(16)} borderRadius={scale(4)} style={styles.mb14} />
                <View style={styles.gridRow}>
                    {[1, 2, 3, 4].map((i) => (
                        <View key={i} style={styles.startCard}>
                            <SkeletonBox width={scale(44)} height={scale(44)} borderRadius={scale(22)} style={styles.mb8} />
                            <SkeletonBox width={scale(40)} height={scale(9)} borderRadius={scale(3)} />
                            <SkeletonBox width={scale(30)} height={scale(9)} borderRadius={scale(3)} style={styles.mt4} />
                        </View>
                    ))}
                </View>
            </View>

            <View style={styles.servicesSection}>
                <View style={styles.headerRow}>
                    <SkeletonBox width={scale(130)} height={scale(16)} borderRadius={scale(4)} />
                    <SkeletonBox width={scale(70)} height={scale(12)} borderRadius={scale(3)} />
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.servicesScroll}
                >
                    {[1, 2, 3, 4].map((i) => (
                        <View key={i} style={styles.serviceCard}>
                            <SkeletonBox width={scale(34)} height={scale(34)} borderRadius={scale(17)} style={styles.mb8} />
                            <SkeletonBox width={scale(70)} height={scale(10)} borderRadius={scale(3)} />
                            <SkeletonBox width={scale(50)} height={scale(9)} borderRadius={scale(3)} style={styles.mt4} />
                        </View>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.sectionContainer}>
                <View style={styles.whyCard}>
                    <SkeletonBox
                        width={scale(150)}
                        height={scale(14)}
                        borderRadius={scale(4)}
                        style={[styles.whiteLightSkeleton, styles.centered, styles.mb18]}
                    />
                    <View style={styles.statsRow}>
                        {[1, 2, 3].map((item, idx) => (
                            <React.Fragment key={item}>
                                {idx > 0 && <View style={styles.statDivider} />}
                                <View style={styles.statCol}>
                                    <SkeletonBox width={scale(20)} height={scale(20)} borderRadius={scale(10)} style={[styles.whiteLightSkeleton, styles.mb8]} />
                                    <SkeletonBox width={scale(45)} height={scale(12)} borderRadius={scale(3)} style={styles.whiteLightSkeleton} />
                                    <SkeletonBox width={scale(55)} height={scale(10)} borderRadius={scale(3)} style={[styles.whiteLightSkeletonSub, styles.mt4]} />
                                </View>
                            </React.Fragment>
                        ))}
                    </View>
                </View>
            </View>

            <View style={styles.sectionContainer}>
                <SkeletonBox width={scale(110)} height={scale(16)} borderRadius={scale(4)} style={styles.mb14} />
                <View style={styles.insightCard}>
                    <SkeletonBox width={scale(100)} height={scale(72)} borderRadius={scale(12)} />
                    <View style={styles.insightContent}>
                        <SkeletonBox width="95%" height={scale(13)} borderRadius={scale(3)} />
                        <SkeletonBox width="70%" height={scale(13)} borderRadius={scale(3)} style={styles.mt4} />
                        <SkeletonBox width={scale(75)} height={scale(12)} borderRadius={scale(3)} style={styles.mt10} />
                    </View>
                </View>
            </View>

            <View style={styles.sectionContainer}>
                <View style={styles.clientBanner}>
                    <SkeletonBox width={scale(38)} height={scale(38)} borderRadius={scale(19)} style={{ marginRight: scale(12) }} />
                    <View style={styles.flex1}>
                        <SkeletonBox width="85%" height={scale(12)} borderRadius={scale(3)} />
                        <SkeletonBox width="95%" height={scale(9)} borderRadius={scale(3)} style={styles.mt4} />
                    </View>
                    <SkeletonBox width={scale(80)} height={scale(28)} borderRadius={scale(8)} style={{ marginLeft: scale(8) }} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        paddingBottom: scale(64),
        paddingHorizontal: scale(20),
        borderBottomLeftRadius: scale(28),
        borderBottomRightRadius: scale(28),
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: scale(24),
    },
    brandContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    greetingSection: {
        marginTop: scale(4),
    },
    whiteLightSkeleton: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },
    whiteLightSkeletonSub: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },

    heroWrapper: {
        width: '100%',
        paddingHorizontal: scale(16),
        marginTop: -scale(40),
        zIndex: 5,
    },
    heroCard: {
        backgroundColor: '#FFF',
        borderRadius: scale(20),
        paddingHorizontal: scale(20),
        paddingVertical: scale(20),
        flexDirection: 'row',
        minHeight: scale(160),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 6,
    },
    heroLeftCol: {
        flex: 0.6,
        justifyContent: 'center',
    },
    heroRightCol: {
        flex: 0.4,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },

    sectionContainer: {
        marginTop: scale(28),
        paddingHorizontal: scale(16),
    },
    gridRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    startCard: {
        width: '23%',
        backgroundColor: '#FFF',
        borderRadius: scale(16),
        paddingVertical: scale(14),
        paddingHorizontal: scale(4),
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
    },

    servicesSection: {
        marginTop: scale(28),
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: scale(16),
        marginBottom: scale(14),
    },
    servicesScroll: {
        paddingLeft: scale(16),
        paddingRight: scale(8),
    },
    serviceCard: {
        width: scale(105),
        height: scale(140),
        marginRight: scale(10),
        borderRadius: scale(16),
        backgroundColor: '#E2E8F0',
        padding: scale(10),
        justifyContent: 'flex-end',
        alignItems: 'center',
    },

    whyCard: {
        backgroundColor: '#062A3F',
        borderRadius: scale(16),
        paddingVertical: scale(20),
        paddingHorizontal: scale(16),
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    statCol: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statDivider: {
        width: 1,
        height: scale(40),
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },

    insightCard: {
        backgroundColor: '#FFF',
        borderRadius: scale(16),
        padding: scale(12),
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
    },
    insightContent: {
        flex: 1,
        marginLeft: scale(14),
        justifyContent: 'center',
    },

    clientBanner: {
        flexDirection: 'row',
        backgroundColor: '#EBF5F1',
        borderWidth: 1,
        borderColor: '#CDE3D9',
        borderRadius: scale(16),
        padding: scale(12),
        alignItems: 'center',
    },

    flex1: {
        flex: 1,
    },
    centered: {
        alignSelf: 'center',
    },
    mt4: {
        marginTop: scale(4),
    },
    mt6: {
        marginTop: scale(6),
    },
    mt8: {
        marginTop: scale(8),
    },
    mt10: {
        marginTop: scale(10),
    },
    mt12: {
        marginTop: scale(12),
    },
    mt14: {
        marginTop: scale(14),
    },
    mb8: {
        marginBottom: scale(8),
    },
    mb14: {
        marginBottom: scale(14),
    },
    mb18: {
        marginBottom: scale(18),
    },
});

export default HomeSkeleton;