import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    FlatList,
} from 'react-native';
import { colors } from '../../../../assets/styles/Colors';

interface UserItem {
    id: string;
    name: string;
    email: string;
}

interface UserPickerModalProps {
    visible: boolean;
    title: string;
    data: UserItem[];
    onSelect: (item: UserItem) => void;
    onClose: () => void;
}

const PickerItemDivider = () => <View style={styles.pickerItemDivider} />;

const UserPickerModal: React.FC<UserPickerModalProps> = ({
    visible,
    title,
    data,
    onSelect,
    onClose,
}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}>
            <TouchableOpacity
                style={styles.pickerBackdrop}
                activeOpacity={1}
                onPress={onClose}>
                <View style={styles.pickerContainer}>
                    <View style={styles.pickerHeader}>
                        <Text style={styles.pickerHeaderTitle}>Pilih {title}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.pickerCloseBtnText}>Tutup</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.modalDivider} />
                    {data.length === 0 ? (
                        <Text style={styles.pickerEmptyText}>Tidak ada data {title} terdaftar</Text>
                    ) : (
                        <FlatList
                            data={data}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.pickerItem}
                                    onPress={() => onSelect(item)}>
                                    <Text style={styles.pickerItemName}>{item.name}</Text>
                                    <Text style={styles.pickerItemEmail}>{item.email}</Text>
                                </TouchableOpacity>
                            )}
                            ItemSeparatorComponent={PickerItemDivider}
                            style={styles.pickerList}
                        />
                    )}
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    pickerBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    pickerContainer: {
        backgroundColor: colors.white,
        borderRadius: 16,
        width: '100%',
        maxHeight: '80%',
        padding: 20,
        elevation: 10,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
    },
    pickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    pickerHeaderTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: colors.textPrimary,
    },
    pickerCloseBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.secondary,
    },
    modalDivider: {
        height: 1,
        backgroundColor: colors.borderLight,
        marginBottom: 16,
    },
    pickerEmptyText: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        marginVertical: 20,
    },
    pickerList: {
        marginTop: 4,
    },
    pickerItem: {
        paddingVertical: 12,
    },
    pickerItemName: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    pickerItemEmail: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2,
    },
    pickerItemDivider: {
        height: 1,
        backgroundColor: colors.borderLight,
    },
});

export default UserPickerModal;
