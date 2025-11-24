import { StyleSheet, TouchableOpacity, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

interface Exercise {
  id: string;
  title: string;
  description: string;
  route: string;
}

const exercises: Exercise[] = [
  {
    id: '1',
    title: 'Bài 1: Danh sách sinh viên',
    description: 'Hiển thị danh sách 20 sinh viên với FlatList',
    route: '/home/bai1',
  },
  {
    id: '2',
    title: 'Bài 2: Form đăng nhập',
    description: 'Form đăng nhập với validation',
    route: '/home/bai2',
  },
  {
    id: '3',
    title: 'Bài 3: Đồng hồ đếm ngược',
    description: 'Đếm ngược với haptic feedback',
    route: '/home/bai3',
  },
  {
    id: '4',
    title: 'Bài 4: To-Do App',
    description: 'Quản lý công việc với AsyncStorage',
    route: '/home/bai4',
  },
  {
    id: '5',
    title: 'Bài 5: Xem hình ảnh',
    description: 'Grid ảnh với modal full-screen',
    route: '/home/bai5',
  },
  {
    id: '6',
    title: 'Bài 6: Gọi API thời tiết',
    description: 'Lấy thông tin thời tiết từ API',
    route: '/home/bai6',
  },
  {
    id: '8',
    title: 'Bài 8: Danh sách bài viết',
    description: 'FlatList với load more, reload và tìm kiếm',
    route: '/home/bai8',
  },
];

export default function HomeScreen() {
  const router = useRouter();

  const handleExercisePress = (route: string) => {
    router.push(route);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bài Tập</Text>
      </View>
      <ScrollView contentContainerStyle={styles.list}>
        {exercises.map((exercise) => (
          <TouchableOpacity
            key={exercise.id}
            style={styles.item}
            onPress={() => handleExercisePress(exercise.route)}
            activeOpacity={0.7}>
            <Text style={styles.subtitle}>{exercise.title}</Text>
            <Text style={styles.description}>{exercise.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  list: {
    padding: 16,
  },
  item: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  description: {
    marginTop: 8,
    fontSize: 14,
    opacity: 0.7,
  },
});

