import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const POSTS_PER_PAGE = 20;

export default function Bai8Screen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchPosts(true);
  }, []);

  useEffect(() => {
    filterPosts();
  }, [searchQuery, posts, currentPage]);

  const fetchPosts = async (isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      // API không hỗ trợ pagination, nên ta sẽ fetch tất cả và phân trang ở client
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      const data: Post[] = await response.json();

      setPosts(data);
      if (isInitial) {
        setCurrentPage(1);
      }
      setHasMore(data.length > currentPage * POSTS_PER_PAGE);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  const filterPosts = () => {
    if (!searchQuery.trim()) {
      // Nếu không có search query, hiển thị posts theo pagination
      const endIndex = currentPage * POSTS_PER_PAGE;
      setFilteredPosts(posts.slice(0, endIndex));
      setHasMore(posts.length > endIndex);
    } else {
      // Filter posts theo search query (hiển thị tất cả kết quả tìm kiếm)
      const query = searchQuery.toLowerCase();
      const filtered = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.body.toLowerCase().includes(query)
      );
      setFilteredPosts(filtered);
      setHasMore(false); // Không load more khi đang search
    }
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setSearchQuery('');
    setCurrentPage(1);
    fetchPosts(true);
  }, []);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore && !searchQuery.trim() && posts.length > 0) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      // filterPosts sẽ được gọi tự động qua useEffect
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postItem}>
      <Text style={[styles.postTitle, styles.subtitle]}>
        {item.title}
      </Text>
      <Text style={styles.postBody} numberOfLines={3}>
        {item.body}
      </Text>
      <View style={styles.postMeta}>
        <Text style={styles.postMetaText}>User ID: {item.userId}</Text>
        <Text style={styles.postMetaText}>Post ID: {item.id}</Text>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#007AFF" />
        <Text style={styles.footerText}>Đang tải thêm...</Text>
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.emptyText}>Đang tải bài viết...</Text>
        </View>
      );
    }

    if (searchQuery.trim() && filteredPosts.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Không tìm thấy bài viết nào với từ khóa "{searchQuery}"
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Không có bài viết nào</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Tìm kiếm bài viết..."
            placeholderTextColor="#999"
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        {searchQuery.trim() && (
          <Text style={styles.searchResultText}>
            Tìm thấy {filteredPosts.length} bài viết
          </Text>
        )}
      </View>

      <FlatList
        data={filteredPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  searchContainer: {
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128,128,128,0.2)',
    backgroundColor: '#fff',
  },
  searchInputContainer: { flexDirection: 'row', alignItems: 'center', position: 'relative' },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    paddingRight: 40,
    fontSize: 16,
    backgroundColor: '#fefefe',
    color: '#333',
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: { color: '#666', fontSize: 16, fontWeight: 'bold' },
  searchResultText: { marginTop: 8, fontSize: 14, opacity: 0.7 },
  list: { padding: 16 },
  postItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  postTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#222' },
  postBody: { fontSize: 14, lineHeight: 20, color: '#555', marginBottom: 12 },
  postMeta: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 8 },
  postMetaText: { fontSize: 12, color: '#888' },
  footer: { padding: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  footerText: { fontSize: 14, color: '#666' },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#999', textAlign: 'center' },
});

