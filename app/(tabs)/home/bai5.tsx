import { useState, useRef, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Modal, Dimensions, ScrollView, Image, View, Text } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const IMAGE_SIZE = (SCREEN_WIDTH - 32 - 16) / 3; // 3 columns with padding and gaps

const imageUrls = [
  'https://picsum.photos/400/400?random=1',
  'https://picsum.photos/400/400?random=2',
  'https://picsum.photos/400/400?random=3',
  'https://picsum.photos/400/400?random=4',
  'https://picsum.photos/400/400?random=5',
  'https://picsum.photos/400/400?random=6',
  'https://picsum.photos/400/400?random=7',
  'https://picsum.photos/400/400?random=8',
  'https://picsum.photos/400/400?random=9',
  'https://picsum.photos/400/400?random=10',
  'https://picsum.photos/400/400?random=11',
  'https://picsum.photos/400/400?random=12',
  'https://picsum.photos/400/400?random=13',
  'https://picsum.photos/400/400?random=14',
  'https://picsum.photos/400/400?random=15',
  'https://picsum.photos/400/400?random=16',
  'https://picsum.photos/400/400?random=17',
  'https://picsum.photos/400/400?random=18',
];

export default function Bai5Screen() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (selectedIndex !== null && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: selectedIndex * SCREEN_WIDTH,
          animated: false,
        });
      }, 100);
    }
  }, [selectedIndex]);

  const handleImagePress = (index: number) => {
    setSelectedIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedIndex(null);
  };

  const handleScroll = (event: { nativeEvent: { contentOffset: { x: number } } }) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    if (index >= 0 && index < imageUrls.length && index !== selectedIndex) {
      setSelectedIndex(index);
    }
  };

  const renderGridItem = (url: string, index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.gridItem}
      onPress={() => handleImagePress(index)}
      activeOpacity={0.8}>
      <Image source={{ uri: url }} style={styles.gridImage} resizeMode="cover" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {imageUrls.map((url, index) => renderGridItem(url, index))}
      </View>

      <Modal visible={selectedIndex !== null} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={styles.modalScrollView}>
            {imageUrls.map((url, index) => (
              <Image
                key={index}
                source={{ uri: url }}
                style={styles.modalImage}
                resizeMode="contain"
              />
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 8,
  },
  gridItem: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 8,
    overflow: 'hidden',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalScrollView: {
    flex: 1,
  },
  modalImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
});

