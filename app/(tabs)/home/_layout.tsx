import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Stack.Screen
        name="bai1"
        options={{
          title: 'Bài 1: Danh sách sinh viên',
        }}
      />
      <Stack.Screen
        name="bai2"
        options={{
          title: 'Bài 2: Form đăng nhập',
        }}
      />
      <Stack.Screen
        name="bai3"
        options={{
          title: 'Bài 3: Đồng hồ đếm ngược',
        }}
      />
      <Stack.Screen
        name="bai4"
        options={{
          title: 'Bài 4: To-Do App',
        }}
      />
      <Stack.Screen
        name="bai5"
        options={{
          title: 'Bài 5: Xem hình ảnh',
        }}
      />
      <Stack.Screen
        name="bai6"
        options={{
          title: 'Bài 6: Thời tiết',
        }}
      />
      <Stack.Screen
        name="bai8"
        options={{
          title: 'Bài 8: Danh sách bài viết',
        }}
      />
    </Stack>
  );
}

