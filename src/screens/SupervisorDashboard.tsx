import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Title, Paragraph, Button, Chip, Avatar, DataTable, FAB } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { motion } from '../utils/motion';
import { AmplifyAuthService } from '../services/amplifyAuthService';
import { AmplifyUserManagementService } from '../services/amplifyUserManagementService';
import { GamificationService } from '../services/gamificationService';
import { Supervisor, Waiter, Leaderboard } from '../types';

interface SupervisorDashboardProps {
  navigation: any;
}

const SupervisorDashboard: React.FC<SupervisorDashboardProps> = ({ navigation }) => {
  const [supervisor, setSupervisor] = useState<Supervisor | null>(null);
  const [managedWaiters, setManagedWaiters] = useState<Waiter[]>([]);
  const [teamStats, setTeamStats] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<Leaderboard | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const authService = AmplifyAuthService.getInstance();
      const userManagementService = AmplifyUserManagementService.getInstance();
      const gamificationService = GamificationService.getInstance();

      const currentUser = await authService.getCurrentUser();
      if (currentUser?.role === 'supervisor') {
        setSupervisor(currentUser as Supervisor);
        
        // Load managed waiters
        const waiters = await userManagementService.getWaitersBySupervisor(currentUser.id);
        setManagedWaiters(waiters);
        
        // Load team statistics
        const stats = await userManagementService.getTeamStats(currentUser.id);
        setTeamStats(stats);
        
        // Load leaderboard
        const leaderboardData = await gamificationService.getLeaderboard('weekly');
        setLeaderboard(leaderboardData);
      }
    } catch (error) {
      console.error('Load data error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  const handleAddWaiter = () => {
    navigation.navigate('AddWaiter');
  };

  const handleManageWaiter = (waiter: Waiter) => {
    navigation.navigate('ManageWaiter', { waiterId: waiter.id });
  };

  if (isLoading || !supervisor) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card style={styles.headerCard}>
            <Card.Content>
              <View style={styles.headerContent}>
                <View style={styles.headerInfo}>
                  <Title style={styles.welcomeText}>Welcome back,</Title>
                  <Title style={styles.nameText}>{supervisor.name}</Title>
                  <Paragraph style={styles.roleText}>Team Supervisor</Paragraph>
                </View>
                <Avatar.Text 
                  size={64} 
                  label={supervisor.name.split(' ').map(n => n[0]).join('')}
                  style={styles.avatar}
                />
              </View>
            </Card.Content>
          </Card>
        </motion.div>

        {/* Team Statistics */}
        {teamStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card style={styles.statsCard}>
              <Card.Content>
                <Title style={styles.sectionTitle}>Team Overview</Title>
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{teamStats.activeWaiters}</Text>
                    <Text style={styles.statLabel}>Active Waiters</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{teamStats.totalPoints}</Text>
                    <Text style={styles.statLabel}>Total Points</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{teamStats.averageRating.toFixed(1)}</Text>
                    <Text style={styles.statLabel}>Avg Rating</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{teamStats.totalWaiters}</Text>
                    <Text style={styles.statLabel}>Total Team</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </motion.div>
        )}

        {/* Top Performer */}
        {teamStats?.topPerformer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card style={styles.topPerformerCard}>
              <Card.Content>
                <Title style={styles.sectionTitle}>🏆 Top Performer</Title>
                <View style={styles.topPerformerContent}>
                  <Avatar.Text 
                    size={48} 
                    label={teamStats.topPerformer.name.split(' ').map((n: string) => n[0]).join('')}
                  />
                  <View style={styles.topPerformerInfo}>
                    <Text style={styles.topPerformerName}>{teamStats.topPerformer.name}</Text>
                    <Text style={styles.topPerformerStats}>
                      {teamStats.topPerformer.points} points • Level {teamStats.topPerformer.level}
                    </Text>
                    <Text style={styles.topPerformerRating}>
                      ⭐ {teamStats.topPerformer.averageRating.toFixed(1)} avg rating
                    </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </motion.div>
        )}

        {/* Waiters Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card style={styles.waitersCard}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Title style={styles.sectionTitle}>Your Team ({managedWaiters.length})</Title>
                <Button 
                  mode="outlined" 
                  onPress={handleAddWaiter}
                  compact
                >
                  Add Waiter
                </Button>
              </View>
              
              {managedWaiters.length > 0 ? (
                <DataTable>
                  <DataTable.Header>
                    <DataTable.Title>Name</DataTable.Title>
                    <DataTable.Title numeric>Points</DataTable.Title>
                    <DataTable.Title numeric>Level</DataTable.Title>
                    <DataTable.Title numeric>Rating</DataTable.Title>
                    <DataTable.Title>Status</DataTable.Title>
                  </DataTable.Header>

                  {managedWaiters.map((waiter) => (
                    <DataTable.Row 
                      key={waiter.id}
                      onPress={() => handleManageWaiter(waiter)}
                    >
                      <DataTable.Cell>
                        <View style={styles.waiterNameCell}>
                          <Avatar.Text 
                            size={32} 
                            label={waiter.name.split(' ').map(n => n[0]).join('')}
                            style={styles.smallAvatar}
                          />
                          <Text style={styles.waiterName}>{waiter.name}</Text>
                        </View>
                      </DataTable.Cell>
                      <DataTable.Cell numeric>{waiter.points}</DataTable.Cell>
                      <DataTable.Cell numeric>{waiter.level}</DataTable.Cell>
                      <DataTable.Cell numeric>
                        {waiter.averageRating > 0 ? waiter.averageRating.toFixed(1) : 'N/A'}
                      </DataTable.Cell>
                      <DataTable.Cell>
                        <Chip 
                          mode="outlined"
                          style={[
                            styles.statusChip,
                            { backgroundColor: waiter.isActive ? '#e8f5e8' : '#ffeaa7' }
                          ]}
                          textStyle={{
                            color: waiter.isActive ? '#27ae60' : '#f39c12'
                          }}
                        >
                          {waiter.isActive ? 'Active' : 'Inactive'}
                        </Chip>
                      </DataTable.Cell>
                    </DataTable.Row>
                  ))}
                </DataTable>
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="people-outline" size={64} color="#ccc" />
                  <Text style={styles.emptyStateText}>No waiters assigned yet</Text>
                  <Button 
                    mode="contained" 
                    onPress={handleAddWaiter}
                    style={styles.emptyStateButton}
                  >
                    Add Your First Waiter
                  </Button>
                </View>
              )}
            </Card.Content>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card style={styles.actionsCard}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Quick Actions</Title>
              <View style={styles.actionsGrid}>
                <Button 
                  mode="contained"
                  onPress={() => navigation.navigate('TeamAnalytics')}
                  style={styles.actionButton}
                  icon="chart-line"
                >
                  Team Analytics
                </Button>
                <Button 
                  mode="contained"
                  onPress={() => navigation.navigate('ManageShifts')}
                  style={styles.actionButton}
                  icon="clock-outline"
                >
                  Manage Shifts
                </Button>
                <Button 
                  mode="contained"
                  onPress={() => navigation.navigate('ViewReports')}
                  style={styles.actionButton}
                  icon="file-document-outline"
                >
                  View Reports
                </Button>
                <Button 
                  mode="contained"
                  onPress={() => navigation.navigate('TeamLeaderboard')}
                  style={styles.actionButton}
                  icon="trophy-outline"
                >
                  Leaderboard
                </Button>
              </View>
            </Card.Content>
          </Card>
        </motion.div>
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleAddWaiter}
        label="Add Waiter"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  headerCard: {
    marginBottom: 16,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  roleText: {
    fontSize: 14,
    color: '#666',
  },
  avatar: {
    backgroundColor: '#6200ea',
  },
  statsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ea',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  topPerformerCard: {
    marginBottom: 16,
    elevation: 2,
  },
  topPerformerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topPerformerInfo: {
    marginLeft: 16,
    flex: 1,
  },
  topPerformerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  topPerformerStats: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  topPerformerRating: {
    fontSize: 14,
    color: '#f39c12',
    marginTop: 2,
  },
  waitersCard: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  waiterNameCell: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallAvatar: {
    marginRight: 8,
  },
  waiterName: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusChip: {
    height: 28,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  emptyStateButton: {
    marginTop: 8,
  },
  actionsCard: {
    marginBottom: 80,
    elevation: 2,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    marginBottom: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ea',
  },
});

export default SupervisorDashboard;
