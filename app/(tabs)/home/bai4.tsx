import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const STORAGE_KEY = '@todos';

export default function Bai4Screen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState('');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) setTodos(JSON.parse(stored));
    } catch (error) {
      console.error('Error loading todos:', error);
    }
  };

  const saveTodos = async (newTodos: Todo[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTodos));
      setTodos(newTodos);
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  };

  const handleAdd = () => {
    if (!inputText.trim()) return Alert.alert('Lỗi', 'Vui lòng nhập tên công việc');
    const newTodo: Todo = { id: Date.now().toString(), text: inputText.trim(), completed: false };
    saveTodos([...todos, newTodo]);
    setInputText('');
  };

  const handleToggle = (id: string) => {
    const updated = todos.map((t) => t.id === id ? { ...t, completed: !t.completed } : t);
    saveTodos(updated);
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setEditText(todo.text);
  };

  const handleSaveEdit = () => {
    if (!editText.trim()) return Alert.alert('Lỗi', 'Vui lòng nhập tên công việc');
    if (editingTodo) {
      const updated = todos.map((t) => t.id === editingTodo.id ? { ...t, text: editText.trim() } : t);
      saveTodos(updated);
      setEditingTodo(null);
      setEditText('');
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa công việc này?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: () => saveTodos(todos.filter((t) => t.id !== id)) },
    ]);
  };

  const renderItem = ({ item }: { item: Todo }) => (
    <View style={[styles.todoItem, item.completed && styles.todoCompleted]}>
      <TouchableOpacity onPress={() => handleToggle(item.id)} style={styles.todoTextContainer}>
        <Text style={[styles.todoText, item.completed && styles.todoTextCompleted]}>
          {item.text}
        </Text>
      </TouchableOpacity>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(item)}>
          <Text style={styles.editBtnText}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
          <Text style={styles.deleteBtnText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Nhập công việc mới"
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <Text style={styles.addBtnText}>Thêm</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={styles.emptyText}>Chưa có công việc nào</Text>}
      />

      <Modal visible={editingTodo !== null} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sửa công việc</Text>
            <TextInput
              style={styles.modalInput}
              value={editText}
              onChangeText={setEditText}
              placeholder="Nhập tên công việc"
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => { setEditingTodo(null); setEditText(''); }}>
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveEdit}>
                <Text style={styles.saveBtnText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f5f8' },
  inputContainer: { flexDirection: 'row', padding: 16, gap: 12 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 12, backgroundColor: '#fff' },
  addBtn: { backgroundColor: '#0a84ff', paddingHorizontal: 20, borderRadius: 12, justifyContent: 'center' },
  addBtnText: { color: '#fff', fontWeight: '600' },
  todoItem: { flexDirection: 'row', padding: 16, marginBottom: 12, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 2 },
  todoCompleted: { opacity: 0.6 },
  todoTextContainer: { flex: 1 },
  todoText: { fontSize: 16 },
  todoTextCompleted: { textDecorationLine: 'line-through', color: '#999' },
  actions: { flexDirection: 'row', gap: 8 },
  editBtn: { backgroundColor: '#ffcc00', padding: 8, borderRadius: 8 },
  editBtnText: { color: '#fff', fontWeight: '600' },
  deleteBtn: { backgroundColor: '#ff3b30', padding: 8, borderRadius: 8 },
  deleteBtnText: { color: '#fff', fontWeight: '600' },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#999' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: '#fff', borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  modalInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 12, marginBottom: 16 },
  modalActions: { flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, backgroundColor: '#ddd', padding: 12, borderRadius: 12, alignItems: 'center' },
  cancelBtnText: { fontWeight: '600' },
  saveBtn: { flex: 1, backgroundColor: '#0a84ff', padding: 12, borderRadius: 12, alignItems: 'center' },
  saveBtnText: { fontWeight: '600', color: '#fff' },
});
