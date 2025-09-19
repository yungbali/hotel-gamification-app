import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { getDataService } from '../services/dataService';
import { GamificationService } from '../services/gamificationService';
import { FeedbackService } from '../services/feedbackService';
import { AuthService } from '../services/authService';
import { Analytics, LeaderboardEntry, Rating, Shift } from '../types';

interface ManagerDashboardProps {
  navigation: any;
  route: any;
}

const trendLabels: Record<'up' | 'down' | 'stable', string> = {
  up: 'Service improving',
  down: 'Needs attention',
  stable: 'Holding steady',
};

const formatRelativeTime = (timestamp: string | Date): string => {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const diff = Date.now() - date.getTime();
  if (diff < 0) {
    return 'Just now';
  }

  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) {
    return 'Just now';
  }
  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hr${hours > 1 ? 's' : ''} ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

export default function ManagerDashboard({ navigation }: ManagerDashboardProps) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [topPerformers, setTopPerformers] = useState<LeaderboardEntry[]>([]);
  const [recentFeedback, setRecentFeedback] = useState<Rating[]>([]);
  const [waiterCount, setWaiterCount] = useState(0);
  const [trendDirection, setTrendDirection] = useState<'up' | 'down' | 'stable'>('stable');
  const [waiterLookup, setWaiterLookup] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [recentShifts, setRecentShifts] = useState<Array<Shift & { waiterName: string }>>([]);
  const [actionableRatings, setActionableRatings] = useState<Rating[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storageService = getDataService();
      const gamificationService = GamificationService.getInstance();
      const feedbackService = FeedbackService.getInstance();

      const analyticsData = await storageService.calculateAnalytics('week');
      setAnalytics(analyticsData);

      const performers = await gamificationService.getTopPerformers('weekly');
      setTopPerformers(performers.slice(0, 3));

      const users = await storageService.getUsers();
      const waiters = users.filter(user => user.role === 'waiter');
      const activeWaiters = waiters.filter(waiter => waiter.isActive).length;
      setWaiterCount(activeWaiters);
      const lookup = waiters.reduce<Record<string, string>>((acc, waiter) => {
        acc[waiter.id] = waiter.name;
        return acc;
      }, {});
      setWaiterLookup(lookup);

      const feedbackStats = await feedbackService.getFeedbackStats();
      setTrendDirection(feedbackStats.recentTrend);

      const feedback = await feedbackService.getRecentFeedback(undefined, 48);
      feedback.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setRecentFeedback(feedback.slice(0, 5));

      const shifts = await storageService.getShifts();
      const horizon = Date.now() - 72 * 60 * 60 * 1000;
      const recentCompletedShifts = shifts
        .filter(shift => {
          const start = new Date(shift.startTime).getTime();
          return !Number.isNaN(start) && start >= horizon;
        })
        .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
        .slice(0, 8)
        .map(shift => ({
          ...shift,
          waiterName: lookup[shift.waiterId] || 'Team Member',
        }));

      setRecentShifts(recentCompletedShifts as Array<Shift & { waiterName: string }>);

      const allRatings = await storageService.getRatings();
      const actionable = allRatings
        .filter(rating => rating.isFlagged || rating.rating <= 3)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 6)
        .map(rating => ({
          ...rating,
          resolvedBy: rating.resolvedBy,
        }));

      setActionableRatings(actionable);
    } catch (error) {
      console.error('Manager dashboard load error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const averageRatingDisplay = analytics ? analytics.averageRating.toFixed(1) : '--';
  const totalRatingsDisplay = analytics ? analytics.totalRatings : 0;
  const weeklyAverage = analytics && analytics.recentTrends.length > 0
    ? analytics.recentTrends[analytics.recentTrends.length - 1].averageRating
    : 0;
  const weeklyFeedbackCount = analytics
    ? analytics.recentTrends.reduce((sum, trend) => sum + trend.ratings, 0)
    : 0;

  const trendIcon = trendDirection === 'up' ? 'trending-up'
    : trendDirection === 'down' ? 'trending-down'
    : 'analytics';
  const trendColor = trendDirection === 'up' ? '#4CAF50'
    : trendDirection === 'down' ? '#f44336'
    : '#2196F3';
  const trendLabel = trendLabels[trendDirection];

  const getWaiterName = (waiterId: string) => waiterLookup[waiterId] || 'Team Member';

  const formatShiftWindow = (shift: Shift) => {
    const start = new Date(shift.startTime);
    const end = shift.endTime ? new Date(shift.endTime) : null;
    const startLabel = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endLabel = end ? end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'In progress';
    return `${startLabel} – ${endLabel}`;
  };

  const formatShiftDuration = (shift: Shift) => {
    const start = new Date(shift.startTime).getTime();
    const end = shift.endTime ? new Date(shift.endTime).getTime() : Date.now();
    if (Number.isNaN(start) || Number.isNaN(end)) {
      return '';
    }
    const diffMinutes = Math.max(0, Math.round((end - start) / 60000));
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    if (hours === 0) {
      return `${minutes} min`;
    }
    return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
  };

  const handleResolveRating = async (rating: Rating) => {
    try {
      const storageService = getDataService();
      const authService = AuthService.getInstance();
      const manager = await authService.getCurrentUser();
      await storageService.resolveRating(rating.id, manager?.id, rating.resolutionNotes);
      await loadData();
    } catch (error) {
      console.error('Resolve rating error:', error);
    }
  };

  const confirmResolveRating = (rating: Rating) => {
    Alert.alert(
      'Resolve Feedback',
      'Mark this feedback as handled? It will remain for reporting but no longer appear in the action list.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Resolve', onPress: () => handleResolveRating(rating) },
      ]
    );
  };

  const handleDeleteRating = async (rating: Rating) => {
    try {
      const storageService = getDataService();
      await storageService.deleteRating(rating.id);
      await loadData();
    } catch (error) {
      console.error('Delete rating error:', error);
    }
  };

  const confirmDeleteRating = (rating: Rating) => {
    Alert.alert(
      'Delete Feedback',
      'Are you sure you want to permanently remove this rating from history?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => handleDeleteRating(rating) },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Manager Dashboard</Title>
        <Text style={styles.subtitle}>Hospitality performance at a glance</Text>
      </View>

      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Card.Content>
            <View style={styles.statRow}>
              <Ionicons name="star" size={24} color="#FFD700" />
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{averageRatingDisplay}</Text>
                <Text style={styles.statLabel}>Average Rating</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <View style={styles.statRow}>
              <Ionicons name="people" size={24} color="#4CAF50" />
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{totalRatingsDisplay}</Text>
                <Text style={styles.statLabel}>Total Reviews</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <View style={styles.statRow}>
              <Ionicons name="trophy" size={24} color="#FF9800" />
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{waiterCount}</Text>
                <Text style={styles.statLabel}>Active Waiters</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <View style={styles.statRow}>
              <Ionicons name={trendIcon as keyof typeof Ionicons.glyphMap} size={24} color={trendColor} />
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{weeklyAverage ? `${weeklyAverage.toFixed(1)}⭐` : '--'}</Text>
                <Text style={styles.statLabel}>Trend: {trendLabel}</Text>
                <Text style={styles.statSubtext}>{weeklyFeedbackCount} feedbacks this week</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.actionsContainer}>
        <Card style={styles.actionCard}>
          <Card.Content>
            <Title>Quick Actions</Title>
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('Analytics')}
                style={styles.actionButton}
                icon="analytics"
                disabled={isLoading}
              >
                View Analytics
              </Button>
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('Leaderboard')}
                style={styles.actionButton}
                icon="trophy"
                disabled={isLoading}
              >
                Leaderboard
              </Button>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.actionCard}>
          <Card.Content>
            <Title>Top Performers</Title>
            {topPerformers.length === 0 ? (
              <Text style={styles.placeholderText}>
                {isLoading ? 'Collecting latest results…' : 'No feedback yet this week'}
              </Text>
            ) : (
              topPerformers.map((entry, index) => (
                <View key={entry.waiterId} style={styles.topPerformerRow}>
                  <Ionicons
                    name={index === 0 ? 'trophy' : 'medal'}
                    size={18}
                    color={index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32'}
                  />
                  <View style={styles.topPerformerInfo}>
                    <Text style={styles.topPerformerName}>{entry.waiterName}</Text>
                    <Text style={styles.topPerformerStats}>
                      {entry.points} pts • {entry.averageRating.toFixed(1)}⭐
                    </Text>
                  </View>
                </View>
              ))
            )}
          </Card.Content>
        </Card>

        <Card style={styles.actionCard}>
          <Card.Content>
            <Title>Feedback Management</Title>
            {actionableRatings.length === 0 ? (
              <Text style={styles.placeholderText}>
                {isLoading ? 'Checking for feedback tasks…' : 'All recent feedback looks great!'}
              </Text>
            ) : (
              actionableRatings.map((rating, index) => {
                const submitted = new Date(rating.timestamp);
                const isLowScore = rating.rating <= 3;
                const iconName = rating.isFlagged ? 'alert-circle' : isLowScore ? 'alert' : 'information-circle';
                const iconColor = rating.isFlagged ? '#f44336' : isLowScore ? '#FF9800' : '#2196F3';
                const waiterName = getWaiterName(rating.waiterId);
                return (
                  <View
                    key={rating.id}
                    style={[styles.feedbackManageRow, index === actionableRatings.length - 1 && styles.activityItemLast]}
                  >
                    <Ionicons
                      name={iconName as keyof typeof Ionicons.glyphMap}
                      size={18}
                      color={iconColor}
                      style={styles.feedbackManageIcon}
                    />
                    <View style={styles.feedbackManageInfo}>
                      <Text style={styles.feedbackManageTitle}>
                        {rating.rating}⭐ • {waiterName}
                      </Text>
                      {rating.comment ? (
                        <Text style={styles.feedbackManageComment} numberOfLines={2}>
                          “{rating.comment}”
                        </Text>
                      ) : null}
                      <Text style={styles.feedbackManageMeta}>
                        {submitted.toLocaleDateString()} {submitted.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                    <View style={styles.feedbackManageActions}>
                      <Button
                        mode="text"
                        compact
                        onPress={() => confirmResolveRating(rating)}
                      >
                        Resolve
                      </Button>
                      <Button
                        mode="text"
                        compact
                        textColor="#f44336"
                        onPress={() => confirmDeleteRating(rating)}
                      >
                        Delete
                      </Button>
                    </View>
                  </View>
                );
              })
            )}
          </Card.Content>
        </Card>

        <Card style={styles.actionCard}>
          <Card.Content>
            <Title>Shift Log (Last 72h)</Title>
            {recentShifts.length === 0 ? (
              <Text style={styles.placeholderText}>
                {isLoading ? 'Syncing shift history…' : 'No recorded shifts in the last few days'}
              </Text>
            ) : (
              recentShifts.map((shift, index) => {
                const iconName = shift.isActive ? 'play-circle' : 'clock';
                const iconColor = shift.isActive ? '#4CAF50' : '#2196F3';
                const startDate = new Date(shift.startTime);
                return (
                  <View
                    key={shift.id}
                    style={[styles.shiftRow, index === recentShifts.length - 1 && styles.activityItemLast]}
                  >
                    <Ionicons name={iconName as keyof typeof Ionicons.glyphMap} size={18} color={iconColor} />
                    <View style={styles.shiftInfoBlock}>
                      <Text style={styles.shiftWaiter}>{shift.waiterName}</Text>
                      <Text style={styles.shiftMetaText}>
                        {startDate.toLocaleDateString()} • {formatShiftWindow(shift)}
                      </Text>
                    </View>
                    <View style={styles.shiftStats}>
                      <Text style={styles.shiftDuration}>{formatShiftDuration(shift)}</Text>
                      <Text style={styles.shiftPerformance}>
                        {shift.pointsEarned} pts • {shift.ratingsCount} ratings
                      </Text>
                    </View>
                  </View>
                );
              })
            )}
          </Card.Content>
        </Card>

        <Card style={styles.actionCard}>
          <Card.Content>
            <Title>Recent Activity</Title>
            {recentFeedback.length === 0 ? (
              <Text style={styles.placeholderText}>
                {isLoading ? 'Listening for guest feedback…' : 'No guest feedback in the last 48 hours'}
              </Text>
            ) : (
              recentFeedback.map((rating, index) => {
                const iconName = rating.rating >= 4 ? 'star' : rating.rating === 3 ? 'alert-circle' : 'warning';
                const iconColor = rating.rating >= 4 ? '#FFD700' : rating.rating === 3 ? '#FF9800' : '#f44336';
                return (
                  <View
                    key={rating.id}
                    style={[
                      styles.activityItem,
                      index === recentFeedback.length - 1 && styles.activityItemLast,
                    ]}
                  >
                    <Ionicons name={iconName as keyof typeof Ionicons.glyphMap} size={16} color={iconColor} />
                    <Text style={styles.activityText}>
                      {`${rating.rating}⭐ • ${getWaiterName(rating.waiterId)}`}
                      {rating.tableNumber ? ` • ${rating.tableNumber}` : ''}
                      {rating.comment ? ` – "${rating.comment}"` : ''}
                    </Text>
                    <Text style={styles.activityTime}>{formatRelativeTime(rating.timestamp)}</Text>
                  </View>
                );
              })
            )}
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#2196F3',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'white',
    fontSize: 16,
    opacity: 0.8,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    marginBottom: 10,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statContent: {
    marginLeft: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statSubtext: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
  },
  actionsContainer: {
    padding: 10,
  },
  actionCard: {
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  placeholderText: {
    paddingVertical: 8,
    color: '#777',
    fontSize: 13,
  },
  feedbackManageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  feedbackManageIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  feedbackManageInfo: {
    flex: 1,
  },
  feedbackManageTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  feedbackManageComment: {
    fontSize: 13,
    color: '#555',
    marginVertical: 2,
  },
  feedbackManageMeta: {
    fontSize: 11,
    color: '#888',
  },
  feedbackManageActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  topPerformerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  topPerformerInfo: {
    marginLeft: 10,
  },
  topPerformerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  topPerformerStats: {
    fontSize: 12,
    color: '#666',
  },
  shiftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  shiftInfoBlock: {
    flex: 1,
    marginLeft: 10,
  },
  shiftWaiter: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  shiftMetaText: {
    fontSize: 12,
    color: '#666',
  },
  shiftStats: {
    alignItems: 'flex-end',
  },
  shiftDuration: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '600',
  },
  shiftPerformance: {
    fontSize: 11,
    color: '#666',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  activityItemLast: {
    borderBottomWidth: 0,
  },
  activityText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    color: '#333',
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
  },
});
