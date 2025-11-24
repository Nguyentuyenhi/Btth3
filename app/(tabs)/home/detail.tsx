import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function DetailScreen() {
  const params = useLocalSearchParams<{
    id: string;
    title: string;
    description: string;
  }>();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={[styles.title, styles.titleText]}>
          {params.title || 'Detail'}
        </Text>
        <Text style={styles.label}>ID: {params.id}</Text>
        <Text style={styles.description}>
          {params.description || 'No description available'}
        </Text>
      </View>
    </View>
  );
}


export default function DetailScreen() {
  const params = useLocalSearchParams<{
    id: string;
    title: string;
    description: string;
  }>();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={[styles.title, styles.titleText]}>
          {params.title || 'Detail'}
        </Text>
        <Text style={styles.label}>ID: {params.id}</Text>
        <Text style={styles.description}>
          {params.description || 'No description available'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    marginBottom: 20,
  },
  titleText: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  label: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 16,
  },
});


