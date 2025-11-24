import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Student {
  id: string;
  name: string;
  age: number;
  class: string;
}

const students: Student[] = Array.from({ length: 20 }, (_, i) => ({
  id: `${i + 1}`,
  name: `Sinh viên ${i + 1}`,
  age: 18 + Math.floor(Math.random() * 5),
  class: `Lớp ${String.fromCharCode(65 + (i % 5))}${Math.floor(i / 5) + 1}`,
}));

export default function Bai1Screen() {
  const handleItemPress = (student: Student) => {
    Alert.alert('Thông tin sinh viên', student.name);
  };

  const renderItem = ({ item }: { item: Student }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.8}>
      <View style={styles.row}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.class}</Text>
        </View>
      </View>
      <Text style={styles.age}>Tuổi: {item.age}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={students}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  list: {
    padding: 16,
  },
  item: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  badge: {
    backgroundColor: '#0a84ff',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  age: {
    marginTop: 6,
    fontSize: 14,
    color: '#6c757d',
  },
});
