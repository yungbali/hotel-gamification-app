import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Title, Paragraph, Button, Chip, Avatar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { motion } from '../utils/motion';
import { AuthService } from '../services/authService';
import { GamificationService } from '../services/gamificationService';
import { Waiter, Leaderboard } from '../types';

const WaiterDashboard: React.FC = () => {
  const [user, setUser] = useState<Waiter | null>(null);
  const [leaderboard, setLeaderboard] = useState<Leaderboard | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const authService = AuthService.getInstance();
      const gamificationService = GamificationService.getInstance();

      const currentUser = await authService.getCurrentUser();

      if (currentUser?.role === 'waiter') {
        const profile = await gamificationService.getWaiterProfile(currentUser.id);
        const waiterData = (profile || currentUser) as Waiter;
        setUser({ ...waiterData, badges: waiterData.badges || [] });
      }

      const leaderboardData = await gamificationService.getLeaderboard('weekly');
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Load data error:', error);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const userPosition = leaderboard?.entries.findIndex(entry => entry.waiterId === user.id) ?? -1;
  const userRank = userPosition >= 0 ? userPosition + 1 : 'N/A';

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <View style={styles.welcomeSection}>
            <Avatar.Text size={60} label={user.name.charAt(0)} />
            <View style={styles.welcomeText}>
              <Title>Welcome back, {user.name.split(' ')[0]}!</Title>
              <Paragraph>Level {user.level} • {user.points} points</Paragraph>
            </View>
          </View>
        </motion.div>
      </View>

      <View style={styles.statsContainer}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card style={styles.statsCard}>
            <Card.Content>
              <Title style={styles.cardTitle}>Your Performance</Title>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{user.points}</Text>
                  <Text style={styles.statLabel}>Total Points</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{user.level}</Text>
                  <Text style={styles.statLabel}>Level</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{user.averageRating.toFixed(1)}</Text>
                  <Text style={styles.statLabel}>Avg Rating</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{user.totalRatings}</Text>
                  <Text style={styles.statLabel}>Ratings</Text>
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
          <Card style={styles.rankCard}>
            <Card.Content>
              <View style={styles.rankHeader}>
                <Ionicons name="trophy" size={24} color="#FFD700" />
                <Title style={styles.cardTitle}>Weekly Rank</Title>
              </View>
              <View style={styles.rankInfo}>
                <Text style={styles.rankNumber}>#{userRank}</Text>
                <Text style={styles.rankText}>out of {leaderboard?.entries.length || 0} waiters</Text>
              </View>
              {userPosition >= 0 && userPosition < 3 && (
                <Chip 
                  icon="trophy" 
                  style={styles.topRankChip}
                  textStyle={styles.topRankText}
                >
                  Top {userPosition + 1}
                </Chip>
              )}
            </Card.Content>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Card style={styles.badgesCard}>
            <Card.Content>
              <Title style={styles.cardTitle}>Recent Badges</Title>
              <View style={styles.badgesContainer}>
                {user.badges.length > 0 ? (
                  user.badges.slice(0, 3).map((badge, index) => (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      <Chip 
                        icon="star" 
                        style={styles.badgeChip}
                        textStyle={styles.badgeText}
                      >
                        {badge.name}
                      </Chip>
                    </motion.div>
                  ))
                ) : (
                  <Text style={styles.noBadgesText}>
                    Earn your first badge by getting great ratings!
                  </Text>
                )}
              </View>
            </Card.Content>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Card style={styles.quickActionsCard}>
            <Card.Content>
              <Title style={styles.cardTitle}>Quick Actions</Title>
              <View style={styles.actionsContainer}>
                <Button
                  mode="contained"
                  icon="qrcode"
                  style={styles.actionButton}
                  contentStyle={styles.actionButtonContent}
                >
                  Show QR Code
                </Button>
                <Button
                  mode="outlined"
                  icon="trophy"
                  style={styles.actionButton}
                  contentStyle={styles.actionButtonContent}
                >
                  View Leaderboard
                </Button>
              </View>
            </Card.Content>
          </Card>
        </motion.div>
      </View>
    </ScrollView>
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
  welcomeSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeText: {
    marginLeft: 16,
    flex: 1,
  },
  statsContainer: {
    padding: 20,
  },
  statsCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  rankCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  badgesCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  quickActionsCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  rankHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rankInfo: {
    alignItems: 'center',
    marginBottom: 12,
  },
  rankNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  rankText: {
    fontSize: 14,
    color: '#666',
  },
  topRankChip: {
    alignSelf: 'center',
    backgroundColor: '#FFD700',
  },
  topRankText: {
    color: '#000',
    fontWeight: 'bold',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badgeChip: {
    backgroundColor: '#E3F2FD',
  },
  badgeText: {
    color: '#1976D2',
  },
  noBadgesText: {
    color: '#666',
    fontStyle: 'italic',
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    borderRadius: 8,
  },
  actionButtonContent: {
    paddingVertical: 8,
  },
});

export default WaiterDashboard;
