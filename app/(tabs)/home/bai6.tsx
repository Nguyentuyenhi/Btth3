import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  time: string;
}

interface GeocodeResult {
  lat: number;
  lon: number;
  display_name: string;
}

type LoadingState = 'idle' | 'loading' | 'success' | 'error';

const DEFAULT_LATITUDE = 21.046732510551642;
const DEFAULT_LONGITUDE = 105.79222170282267;

export default function Bai6Screen() {
  const [cityName, setCityName] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => { getCurrentLocation(); }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        const defaultLocation = { lat: DEFAULT_LATITUDE, lon: DEFAULT_LONGITUDE };
        setCurrentLocation(defaultLocation);
        fetchWeather(DEFAULT_LATITUDE, DEFAULT_LONGITUDE);
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({ lat: location.coords.latitude, lon: location.coords.longitude });
      fetchWeather(location.coords.latitude, location.coords.longitude);
    } catch {
      const defaultLocation = { lat: DEFAULT_LATITUDE, lon: DEFAULT_LONGITUDE };
      setCurrentLocation(defaultLocation);
      fetchWeather(DEFAULT_LATITUDE, DEFAULT_LONGITUDE);
    }
  };

  const geocodeCity = async (city: string): Promise<GeocodeResult | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`
      );
      const data = await response.json();
      if (data?.length) {
        return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), display_name: data[0].display_name };
      }
      return null;
    } catch {
      return null;
    }
  };

  const fetchWeather = async (latitude: number, longitude: number) => {
    setLoadingState('loading'); setErrorMessage('');
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,relative_humidity_2m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`;
      const data = await (await fetch(url)).json();
      if (data.current) {
        setWeatherData({
          temperature: data.current.temperature_2m,
          humidity: data.current.relative_humidity_2m || data.hourly?.relative_humidity_2m?.[0] || 0,
          windSpeed: data.current.wind_speed_10m,
          time: data.current.time,
        });
        setLoadingState('success');
      } else throw new Error();
    } catch {
      setErrorMessage('Không thể tải dữ liệu thời tiết');
      setLoadingState('error');
    }
  };

  const handleSearch = async () => {
    if (!cityName.trim()) { Alert.alert('Lỗi', 'Vui lòng nhập tên thành phố'); return; }
    setLoadingState('loading'); setErrorMessage('');
    const geocodeResult = await geocodeCity(cityName.trim());
    if (geocodeResult) await fetchWeather(geocodeResult.lat, geocodeResult.lon);
    else { setErrorMessage('Không tìm thấy thành phố'); setLoadingState('error'); }
  };

  const handleUseCurrentLocation = () => currentLocation ? fetchWeather(currentLocation.lat, currentLocation.lon) : getCurrentLocation();

  const getWeatherDescription = (temp: number) => {
    if (temp < 0) return 'Băng giá';
    if (temp < 10) return 'Lạnh';
    if (temp < 20) return 'Mát mẻ';
    if (temp < 30) return 'Ấm áp';
    return 'Nóng';
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            value={cityName}
            onChangeText={setCityName}
            placeholder="Nhập tên thành phố"
            placeholderTextColor="#999"
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.searchButton]} onPress={handleSearch}>
              <Text style={styles.buttonText}>Tìm kiếm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.locationButton]} onPress={handleUseCurrentLocation}>
              <Text style={styles.buttonText}>Vị trí hiện tại</Text>
            </TouchableOpacity>
          </View>
        </View>

        {loadingState === 'loading' && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Đang tải...</Text>
          </View>
        )}

        {loadingState === 'error' && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
          </View>
        )}

        {loadingState === 'success' && weatherData && (
          <View style={styles.weatherCard}>
            <Text style={styles.cityName}>{cityName || 'Vị trí hiện tại'}</Text>
            <Text style={styles.temperature}>{weatherData.temperature.toFixed(1)}°C</Text>
            <Text style={styles.description}>{getWeatherDescription(weatherData.temperature)}</Text>
            <View style={styles.weatherDetails}>
              <Text>Độ ẩm: {weatherData.humidity.toFixed(0)}%</Text>
              <Text>Gió: {weatherData.windSpeed.toFixed(1)} km/h</Text>
            </View>
            <Text style={styles.timeText}>Cập nhật: {new Date(weatherData.time).toLocaleString('vi-VN')}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f7ff' },
  content: { flex: 1, padding: 20, paddingTop: 40 },
  inputGroup: { marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  buttonRow: { flexDirection: 'row', gap: 12 },
  button: { flex: 1, borderRadius: 12, padding: 14, alignItems: 'center' },
  searchButton: { backgroundColor: '#007AFF' },
  locationButton: { backgroundColor: '#34C759' },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  loadingContainer: { alignItems: 'center', padding: 40 },
  loadingText: { marginTop: 12, fontSize: 16 },
  errorContainer: { padding: 20, backgroundColor: 'rgba(255,68,68,0.1)', borderRadius: 12 },
  errorText: { color: '#ff4444', fontSize: 16, textAlign: 'center' },
  weatherCard: { backgroundColor: '#fff', borderRadius: 16, padding: 24, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 5 },
  cityName: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  temperature: { fontSize: 48, fontWeight: 'bold', marginBottom: 4 },
  description: { fontSize: 18, opacity: 0.7, marginBottom: 16 },
  weatherDetails: { flexDirection: 'row', gap: 20, fontSize: 16 },
  timeText: { fontSize: 12, color: '#555', marginTop: 16 },
});
