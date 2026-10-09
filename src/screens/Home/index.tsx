import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { scale } from '../../utils/responsive';

import Header from './header';
import Hero from './hero';
import StartSection from './StartSection';
import ServicesSection from './ServicesSection';
import WhyChooseGsi from './WhyChooseGsi';
import InsightStruktur from './InsightStruktur';
import ClientRegisterBanner from './ClientRegisterBanner';
import BottomNav from '../../components/BottomNav';
import HomeSkeleton from './HomeSkeleton';

function Home(): React.ReactElement {
    const [isLoading, setIsLoading] = useState(true);
    const [isAtBottom, setIsAtBottom] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    const handleScroll = (event: any) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const atBottom =
            layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
        setIsAtBottom(atBottom);
    };

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <View style={styles.scrollWrapper}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                        onScroll={isLoading ? undefined : handleScroll}
                        scrollEventThrottle={16}>

                        {isLoading ? (
                            <HomeSkeleton />
                        ) : (
                            <>
                                <Header />
                                <Hero />
                                <StartSection />
                                <ServicesSection />
                                <WhyChooseGsi />
                                <InsightStruktur />
                                <ClientRegisterBanner />
                            </>
                        )}
                    </ScrollView>
                    
                    {!isLoading && !isAtBottom && (
                        <LinearGradient
                            pointerEvents="none"
                            colors={['transparent', 'rgba(245, 248, 247, 0.8)']}
                            style={styles.bottomGradient}
                        />
                    )}
                </View>
            </View>

            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F8F7',
    },
    contentContainer: {
        flex: 1,
        backgroundColor: '#F5F8F7',
    },
    scrollWrapper: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: scale(24),
    },
    bottomGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 64,
        zIndex: 1,
    },
});

export default Home;