import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Title, Chip, Avatar, SegmentedButtons } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { motion } from '../utils/motion';
import { AuthService } from '../services/authService';
import { GamificationService } from '../services/gamificationService';
import { User, Leaderboard, LeaderboardEntry } from '../types';

const LeaderboardScreen: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [leaderboard, setLeaderboard] = useState<Leaderboard | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedPeriod]);

  const loadData = async () => {
    try {
      const authService = AuthService.getInstance();
      const gamificationService = GamificationService.getInstance();
      
      const currentUser = await authService.getCurrentUser();
      const leaderboardData = await gamificationService.getLeaderboard(
        selectedPeriod as 'weekly' | 'monthly' | 'all-time'
      );
      
      setUser(currentUser);
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

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Ionicons name="trophy" size={24} color="#FFD700" />;
      case 2:
        return <Ionicons name="medal" size={24} color="#C0C0C0" />;
      case 3:
        return <Ionicons name="medal" size={24} color="#CD7F32" />;
      default:
        return <Text style={styles.rankNumber}>#{position}</Text>;
    }
  };

  const getRankColor = (position: number) => {
    switch (position) {
      case 1:
        return '#FFD700';
      case 2:
        return '#C0C0C0';
      case 3:
        return '#CD7F32';
      default:
        return '#666';
    }
  };

  if (!user || !leaderboard) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const userPosition = leaderboard.entries.findIndex(entry => entry.waiterId === user.id);
  const userEntry = userPosition >= 0 ? leaderboard.entries[userPosition] : null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Leaderboard</Title>
        <Text style={styles.headerSubtitle}>
          {leaderboard.period} • Updated {leaderboard.lastUpdated.toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.periodSelector}>
        <SegmentedButtons
          value={selectedPeriod}
          onValueChange={setSelectedPeriod}
          buttons={[
            { value: 'weekly', label: 'Week' },
            { value: 'monthly', label: 'Month' },
            { value: 'all-time', label: 'All Time' },
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
        {userEntry && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card style={[styles.userCard, { borderColor: getRankColor(userPosition + 1) }]}>
              <Card.Content style={styles.userCardContent}>
                <View style={styles.userRank}>
                  {getRankIcon(userPosition + 1)}
                </View>
                <Avatar.Text size={50} label={user.name.charAt(0)} />
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userStats}>
                    {userEntry.points} pts • {userEntry.averageRating.toFixed(1)}⭐
                  </Text>
                </View>
                <View style={styles.userBadges}>
                  {userEntry.badges.slice(0, 2).map((badge, index) => (
                    <Chip key={badge.id} style={styles.badgeChip} textStyle={styles.badgeText}>
                      {badge.name}
                    </Chip>
                  ))}
                </View>
              </Card.Content>
            </Card>
          </motion.div>
        )}

        <View style={styles.leaderboardContainer}>
          <Text style={styles.leaderboardTitle}>Top Performers</Text>
          
          {leaderboard.entries.map((entry, index) => (
            <motion.div
              key={entry.waiterId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Card style={[
                styles.entryCard,
                entry.waiterId === user.id && styles.userEntryCard
              ]}>
                <Card.Content style={styles.entryContent}>
                  <View style={styles.entryRank}>
                    {getRankIcon(index + 1)}
                  </View>
                  
                  <Avatar.Text 
                    size={40} 
                    label={entry.waiterName.charAt(0)}
                    style={styles.entryAvatar}
                  />
                  
                  <View style={styles.entryInfo}>
                    <Text style={styles.entryName}>
                      {entry.waiterName}
                      {entry.waiterId === user.id && ' (You)'}
                    </Text>
                    <View style={styles.entryStats}>
                      <Text style={styles.entryPoints}>{entry.points} pts</Text>
                      <Text style={styles.entryRating}>
                        {entry.averageRating.toFixed(1)}⭐
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.entryLevel}>
                    <Text style={styles.levelText}>Lv.{entry.level}</Text>
                  </View>
                  
                  {entry.change !== 0 && (
                    <View style={styles.changeContainer}>
                      <Ionicons 
                        name={entry.change > 0 ? 'trending-up' : 'trending-down'} 
                        size={16} 
                        color={entry.change > 0 ? '#4CAF50' : '#f44336'} 
                      />
                      <Text style={[
                        styles.changeText,
                        { color: entry.change > 0 ? '#4CAF50' : '#f44336' }
                      ]}>
                        {Math.abs(entry.change)}
                      </Text>
                    </View>
                  )}
                </Card.Content>
              </Card>
            </motion.div>
          ))}
        </View>

        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Legend:</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <Ionicons name="trophy" size={16} color="#FFD700" />
              <Text style={styles.legendText}>1st Place</Text>
            </View>
            <View style={styles.legendItem}>
              <Ionicons name="medal" size={16} color="#C0C0C0" />
              <Text style={styles.legendText}>2nd Place</Text>
            </View>
            <View style={styles.legendItem}>
              <Ionicons name="medal" size={16} color="#CD7F32" />
              <Text style={styles.legendText}>3rd Place</Text>
            </View>
          </View>
        </View>
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
  userCard: {
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  userCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  userRank: {
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userStats: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  userBadges: {
    flexDirection: 'row',
    gap: 4,
  },
  badgeChip: {
    backgroundColor: '#E3F2FD',
    height: 24,
  },
  badgeText: {
    fontSize: 10,
    color: '#1976D2',
  },
  leaderboardContainer: {
    marginBottom: 20,
  },
  leaderboardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  entryCard: {
    marginBottom: 8,
    borderRadius: 8,
  },
  userEntryCard: {
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  entryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  entryRank: {
    width: 30,
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  entryAvatar: {
    marginLeft: 12,
  },
  entryInfo: {
    flex: 1,
    marginLeft: 12,
  },
  entryName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  entryStats: {
    flexDirection: 'row',
    marginTop: 2,
    gap: 12,
  },
  entryPoints: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  entryRating: {
    fontSize: 12,
    color: '#666',
  },
  entryLevel: {
    marginLeft: 8,
  },
  levelText: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  changeText: {
    fontSize: 12,
    marginLeft: 2,
  },
  legend: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  legendItems: {
    flexDirection: 'row',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendText: {
    fontSize: 12,
    marginLeft: 4,
    color: '#666',
  },
});

export default LeaderboardScreen;
