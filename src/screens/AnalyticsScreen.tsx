import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Title, Paragraph, Button, Chip, SegmentedButtons } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { motion } from '../utils/motion';
import { AuthService } from '../services/authService';
import { StorageService } from '../services/storageService';
import { User, Analytics } from '../types';

const AnalyticsScreen: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedPeriod]);

  const loadData = async () => {
    try {
      const authService = AuthService.getInstance();
      const storageService = StorageService.getInstance();

      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);

      const analyticsData = await storageService.calculateAnalytics(selectedPeriod);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Load data error:', error);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  if (!user || !analytics) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Analytics Dashboard</Title>
        <Text style={styles.headerSubtitle}>
          Performance insights and monitoring
        </Text>
      </View>

      <View style={styles.periodSelector}>
        <SegmentedButtons
          value={selectedPeriod}
          onValueChange={setSelectedPeriod}
          buttons={[
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
            { value: 'quarter', label: 'Quarter' },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card style={styles.overviewCard}>
            <Card.Content>
              <Title style={styles.cardTitle}>Overview</Title>
              <View style={styles.overviewGrid}>
                <View style={styles.overviewItem}>
                  <Text style={styles.overviewValue}>{analytics.totalRatings}</Text>
                  <Text style={styles.overviewLabel}>Total Ratings</Text>
                </View>
                <View style={styles.overviewItem}>
                  <Text style={styles.overviewValue}>{analytics.averageRating.toFixed(1)}</Text>
                  <Text style={styles.overviewLabel}>Avg Rating</Text>
                </View>
                <View style={styles.overviewItem}>
                  <Text style={styles.overviewValue}>{analytics.responseRate}%</Text>
                  <Text style={styles.overviewLabel}>Response Rate</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card style={styles.satisfactionCard}>
            <Card.Content>
              <Title style={styles.cardTitle}>Guest Satisfaction</Title>
              <View style={styles.satisfactionGrid}>
                <View style={styles.satisfactionItem}>
                  <View style={[styles.satisfactionBar, { backgroundColor: '#4CAF50', width: `${analytics.guestSatisfaction.excellent}%` }]} />
                  <Text style={styles.satisfactionLabel}>Excellent (5⭐)</Text>
                  <Text style={styles.satisfactionValue}>{analytics.guestSatisfaction.excellent}%</Text>
                </View>
                <View style={styles.satisfactionItem}>
                  <View style={[styles.satisfactionBar, { backgroundColor: '#8BC34A', width: `${analytics.guestSatisfaction.good}%` }]} />
                  <Text style={styles.satisfactionLabel}>Good (4⭐)</Text>
                  <Text style={styles.satisfactionValue}>{analytics.guestSatisfaction.good}%</Text>
                </View>
                <View style={styles.satisfactionItem}>
                  <View style={[styles.satisfactionBar, { backgroundColor: '#FFC107', width: `${analytics.guestSatisfaction.average}%` }]} />
                  <Text style={styles.satisfactionLabel}>Average (3⭐)</Text>
                  <Text style={styles.satisfactionValue}>{analytics.guestSatisfaction.average}%</Text>
                </View>
                <View style={styles.satisfactionItem}>
                  <View style={[styles.satisfactionBar, { backgroundColor: '#FF9800', width: `${analytics.guestSatisfaction.poor}%` }]} />
                  <Text style={styles.satisfactionLabel}>Poor (2⭐)</Text>
                  <Text style={styles.satisfactionValue}>{analytics.guestSatisfaction.poor}%</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card style={styles.topPerformersCard}>
            <Card.Content>
              <Title style={styles.cardTitle}>Top Performers</Title>
              {analytics.topPerformers.map((performer, index) => (
                <View key={performer.waiterId} style={styles.performerItem}>
                  <View style={styles.performerRank}>
                    <Ionicons 
                      name={index === 0 ? "trophy" : index === 1 ? "medal" : "medal"} 
                      size={20} 
                      color={index === 0 ? "#FFD700" : index === 1 ? "#C0C0C0" : "#CD7F32"} 
                    />
                  </View>
                  <View style={styles.performerInfo}>
                    <Text style={styles.performerName}>{performer.waiterName}</Text>
                    <Text style={styles.performerStats}>
                      {performer.points} pts • {performer.averageRating.toFixed(1)}⭐
                    </Text>
                  </View>
                  <View style={styles.performerLevel}>
                    <Text style={styles.levelText}>Lv.{performer.level}</Text>
                  </View>
                </View>
              ))}
            </Card.Content>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Card style={styles.trendsCard}>
            <Card.Content>
              <Title style={styles.cardTitle}>Recent Trends</Title>
              <View style={styles.trendsContainer}>
                {analytics.recentTrends.slice(-5).map((trend, index) => (
                  <View key={trend.date} style={styles.trendItem}>
                    <Text style={styles.trendDate}>
                      {new Date(trend.date).toLocaleDateString()}
                    </Text>
                    <View style={styles.trendStats}>
                      <Text style={styles.trendRatings}>{trend.ratings} ratings</Text>
                      <Text style={styles.trendAverage}>{trend.averageRating.toFixed(1)}⭐</Text>
                    </View>
                  </View>
                ))}
              </View>
            </Card.Content>
          </Card>
        </motion.div>

        {analytics.fraudAlerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Card style={styles.alertsCard}>
              <Card.Content>
                <Title style={styles.cardTitle}>Fraud Alerts</Title>
                {analytics.fraudAlerts.map((alert) => (
                  <View key={alert.id} style={styles.alertItem}>
                    <View style={styles.alertHeader}>
                      <Ionicons 
                        name="warning" 
                        size={20} 
                        color={alert.severity === 'high' ? '#f44336' : alert.severity === 'medium' ? '#FF9800' : '#4CAF50'} 
                      />
                      <Text style={styles.alertType}>{alert.type.replace('_', ' ')}</Text>
                      <Chip 
                        style={[
                          styles.alertChip,
                          { backgroundColor: alert.severity === 'high' ? '#ffebee' : alert.severity === 'medium' ? '#fff3e0' : '#e8f5e8' }
                        ]}
                        textStyle={[
                          styles.alertChipText,
                          { color: alert.severity === 'high' ? '#f44336' : alert.severity === 'medium' ? '#FF9800' : '#4CAF50' }
                        ]}
                      >
                        {alert.severity}
                      </Chip>
                    </View>
                    <Text style={styles.alertDescription}>{alert.description}</Text>
                    <Text style={styles.alertDate}>
                      {alert.detectedAt.toLocaleDateString()}
                    </Text>
                  </View>
                ))}
              </Card.Content>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          <View style={styles.actionsContainer}>
            <Button
              mode="contained"
              icon="download"
              style={styles.actionButton}
              contentStyle={styles.actionButtonContent}
            >
              Export Report
            </Button>
            <Button
              mode="outlined"
              icon="refresh"
              style={styles.actionButton}
              contentStyle={styles.actionButtonContent}
              onPress={onRefresh}
            >
              Refresh Data
            </Button>
          </View>
        </motion.div>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  periodSelector: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  segmentedButtons: {
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  overviewCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  satisfactionCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  topPerformersCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  trendsCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  alertsCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  overviewGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  overviewItem: {
    alignItems: 'center',
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  overviewLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  satisfactionGrid: {
    gap: 12,
  },
  satisfactionItem: {
    position: 'relative',
  },
  satisfactionBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  satisfactionLabel: {
    fontSize: 12,
    color: '#666',
  },
  satisfactionValue: {
    position: 'absolute',
    right: 0,
    top: 16,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  performerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  performerRank: {
    width: 30,
  },
  performerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  performerName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  performerStats: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  performerLevel: {
    marginLeft: 8,
  },
  levelText: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
  },
  trendsContainer: {
    gap: 8,
  },
  trendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  trendDate: {
    fontSize: 12,
    color: '#666',
  },
  trendStats: {
    flexDirection: 'row',
    gap: 12,
  },
  trendRatings: {
    fontSize: 12,
    color: '#2196F3',
  },
  trendAverage: {
    fontSize: 12,
    color: '#666',
  },
  alertItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  alertType: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
  },
  alertChip: {
    height: 20,
  },
  alertChipText: {
    fontSize: 10,
  },
  alertDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  alertDate: {
    fontSize: 10,
    color: '#999',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
  },
  actionButtonContent: {
    paddingVertical: 8,
  },
});

export default AnalyticsScreen;
