import { ActionButton } from '../../components/ui/ActionButton';
import { styles } from './SurveyRequestsScreen.styles';
import { ErrorNotice } from '../../components/common/ErrorNotice';
import { palette } from '../../theme/tokens';
import { JSX } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { scale } from '../../utils/responsive';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSurveyRequests } from '../../hooks/useSurveyRequests';

function SurveyRequestsScreen(): JSX.Element {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const {
    user,
    filteredRequests,
    search,
    setSearch,
    activeFilter,
    setActiveFilter,
    totalCount,
    pendingCount,
    claimedCount,
    isLoading,
    error,
    refreshRequests,
    handleClaim,
    handleDelete,
    handleCallPhone,
    handleOpenWhatsApp,
  } = useSurveyRequests();

  const isAdmin = user?.role === 'admin';

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#002239', palette.brand]}
        style={[
          styles.headerGradient,
          { paddingTop: insets.top > 0 ? insets.top + scale(8) : scale(16) },
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerTopRow}>
          <ActionButton
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Kembali"
          >
            <Icon name="arrow-left" size={scale(20)} color={palette.white} />
          </ActionButton>
          <Text style={styles.headerTitle}>Daftar Pengajuan Survey</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>
        <Text style={styles.headerSubtitle}>
          Pantau dan ambil permohonan survey dari calon klien baru.
        </Text>
      </LinearGradient>

      <View style={styles.body}>
        <ErrorNotice message={error} onRetry={refreshRequests} />
        <View style={styles.searchBox}>
          <Icon
            name="search"
            size={16}
            color={palette.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari nama, perusahaan, atau lokasi..."
            placeholderTextColor={palette.grey}
            value={search}
            onChangeText={setSearch}
            accessibilityLabel="Cari nama, perusahaan, atau lokasi..."
          />
          {search.length > 0 && (
            <ActionButton
              onPress={() => setSearch('')}
              style={styles.clearSearchBtn}
              accessibilityRole="button"
              accessibilityLabel="Tutup"
            >
              <Icon name="x" size={14} color={palette.textSecondary} />
            </ActionButton>
          )}
        </View>

        <View style={styles.filterRow}>
          <ActionButton
            compact
            style={[styles.chip, activeFilter === 'all' && styles.chipActive]}
            onPress={() => setActiveFilter('all')}
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.chipText,
                activeFilter === 'all' && styles.chipTextActive,
              ]}
            >
              Semua ({totalCount})
            </Text>
          </ActionButton>
          <ActionButton
            compact
            style={[
              styles.chip,
              activeFilter === 'pending' && styles.chipActive,
            ]}
            onPress={() => setActiveFilter('pending')}
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.chipText,
                activeFilter === 'pending' && styles.chipTextActive,
              ]}
            >
              Belum Dihubungi ({pendingCount})
            </Text>
          </ActionButton>
          <ActionButton
            compact
            style={[
              styles.chip,
              activeFilter === 'claimed' && styles.chipActive,
            ]}
            onPress={() => setActiveFilter('claimed')}
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.chipText,
                activeFilter === 'claimed' && styles.chipTextActive,
              ]}
            >
              Sudah Dihubungi ({claimedCount})
            </Text>
          </ActionButton>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refreshRequests}
              colors={[palette.brand]}
            />
          }
        >
          {filteredRequests.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="inbox" size={40} color="#BDBDBD" />
              <Text style={styles.emptyTitle}>Tidak Ada Pengajuan Survey</Text>
              <Text style={styles.emptySub}>
                {search
                  ? 'Tidak ditemukan hasil pengajuan yang cocok.'
                  : 'Belum ada pengajuan survey pada kategori ini.'}
              </Text>
            </View>
          ) : (
            filteredRequests.map(item => {
              const isClaimed = item.status === 'claimed';

              return (
                <View key={item.id} style={styles.card}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.clientInfoCol}>
                      <Text style={styles.clientName}>{item.clientName}</Text>
                      <Text style={styles.companyName}>{item.companyName}</Text>
                    </View>

                    <View style={styles.headerRightCol}>
                      {isClaimed ? (
                        <View style={styles.claimedBadgePill}>
                          <Icon
                            name="check-circle"
                            size={12}
                            color={palette.brand}
                            style={styles.badgeIcon}
                          />
                          <Text style={styles.claimedBadgeText}>
                            Sudah Dihubungi
                          </Text>
                        </View>
                      ) : (
                        <View style={styles.pendingBadgePill}>
                          <Icon
                            name="clock"
                            size={12}
                            color="#E65100"
                            style={styles.badgeIcon}
                          />
                          <Text style={styles.pendingBadgeText}>
                            Belum Dihubungi
                          </Text>
                        </View>
                      )}

                      {isAdmin && (
                        <ActionButton
                          style={styles.deleteBtn}
                          onPress={() => handleDelete(item)}
                          activeOpacity={0.7}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          accessibilityRole="button"
                          accessibilityLabel="Hapus"
                        >
                          <Icon name="trash-2" size={15} color="#E53935" />
                        </ActionButton>
                      )}
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.detailRow}>
                    <Icon
                      name="layers"
                      size={14}
                      color={palette.textSecondary}
                    />
                    <Text style={styles.detailText}>{item.structureType}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Icon
                      name="map-pin"
                      size={14}
                      color={palette.textSecondary}
                    />
                    <Text style={styles.detailText}>{item.location}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Icon
                      name="calendar"
                      size={14}
                      color={palette.textSecondary}
                    />
                    <Text style={styles.detailText}>
                      Diajukan: {item.submittedDate}
                    </Text>
                  </View>

                  {item.notes ? (
                    <View style={styles.notesBox}>
                      <Text style={styles.notesLabel}>Catatan Klien:</Text>
                      <Text style={styles.notesText}>{item.notes}</Text>
                    </View>
                  ) : null}

                  {isClaimed ? (
                    <View style={styles.claimedFooter}>
                      <View style={styles.claimedByRow}>
                        <Icon
                          name="user-check"
                          size={14}
                          color={palette.brand}
                        />
                        <Text style={styles.claimedByText}>
                          Sudah dihubungi oleh:{' '}
                          {item.claimedBy || 'Staf Marketing GSI'} (
                          {item.claimedAt || 'Selesai'})
                        </Text>
                      </View>

                      <View style={styles.contactBtnRow}>
                        <ActionButton
                          style={styles.contactBtnCall}
                          onPress={() => handleCallPhone(item)}
                          accessibilityRole="button"
                        >
                          <Icon name="phone" size={14} color="#00796B" />
                          <Text style={styles.contactBtnCallText}>Telepon</Text>
                        </ActionButton>

                        <ActionButton
                          style={styles.contactBtnWA}
                          onPress={() => handleOpenWhatsApp(item)}
                          accessibilityRole="button"
                        >
                          <Icon
                            name="message-circle"
                            size={14}
                            color={palette.brand}
                          />
                          <Text style={styles.contactBtnWAText}>WhatsApp</Text>
                        </ActionButton>

                        <ActionButton
                          style={styles.contactBtnProject}
                          onPress={() =>
                            navigation.navigate('CreateProject', {
                              initialProjectName: `${item.structureType} - ${item.companyName}`,
                              initialClientName: item.clientName,
                              initialServiceType: item.structureType,
                              surveyBookingId: item.rawDbId,
                            })
                          }
                          accessibilityRole="button"
                        >
                          <Icon name="plus-circle" size={14} color="#004D40" />
                          <Text style={styles.contactBtnProjectText}>
                            Buat Proyek
                          </Text>
                        </ActionButton>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.actionFooter}>
                      <ActionButton
                        style={styles.claimActionBtn}
                        activeOpacity={0.85}
                        onPress={() => handleClaim(item)}
                        accessibilityRole="button"
                      >
                        <Icon
                          name="user-plus"
                          size={16}
                          color={palette.white}
                        />
                        <Text style={styles.claimActionBtnText}>
                          Ambil & Hubungi Klien
                        </Text>
                      </ActionButton>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </ScrollView>
      </View>
    </View>
  );
}

export default SurveyRequestsScreen;
