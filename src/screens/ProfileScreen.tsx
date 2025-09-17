import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Title, Paragraph, Button, Avatar, List, Switch } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { motion } from '../utils/motion';
import { AuthService } from '../services/authService';
import { GamificationService } from '../services/gamificationService';
import { FeedbackService } from '../services/feedbackService';
import { User, Waiter, Manager, Rating } from '../types';

const ProfileScreen: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [recentFeedback, setRecentFeedback] = useState<Rating[]>([]);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const authService = AuthService.getInstance();
      const gamificationService = GamificationService.getInstance();
      const feedbackService = FeedbackService.getInstance();
      const currentUser = await authService.getCurrentUser();

      if (currentUser?.role === 'waiter') {
        const profile = await gamificationService.getWaiterProfile(currentUser.id);
        const resolvedUser = (profile || currentUser) as Waiter;
        setUser(resolvedUser);

        const feedback = await feedbackService.getRecentFeedback(resolvedUser.id, 72);
        setRecentFeedback(feedback.slice(0, 5));
      } else {
        setUser(currentUser);
        setRecentFeedback([]);
      }
    } catch (error) {
      console.error('Load user error:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout },
      ]
    );
  };

  const logout = async () => {
    try {
      const authService = AuthService.getInstance();
      await authService.logout();
      // Navigation will be handled by the main App component
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const isWaiter = user.role === 'waiter';
  const isManager = user.role === 'manager';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <View style={styles.profileSection}>
            <Avatar.Text size={80} label={user.name.charAt(0)} />
            <View style={styles.profileInfo}>
              <Title style={styles.userName}>{user.name}</Title>
              <Text style={styles.userRole}>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          </View>
        </motion.div>
      </View>

      <View style={styles.content}>
        {isWaiter && (
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
                    <Text style={styles.statValue}>{(user as Waiter).points || 0}</Text>
                    <Text style={styles.statLabel}>Total Points</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{(user as Waiter).level || 1}</Text>
                    <Text style={styles.statLabel}>Level</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{(user as Waiter).averageRating?.toFixed(1) || '0.0'}</Text>
                    <Text style={styles.statLabel}>Avg Rating</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{(user as Waiter).totalRatings || 0}</Text>
                    <Text style={styles.statLabel}>Ratings</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </motion.div>
        )}

        {isWaiter && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card style={styles.feedbackCard}>
              <Card.Content>
                <Title style={styles.cardTitle}>Recent Guest Feedback</Title>
                {recentFeedback.length === 0 ? (
                  <Text style={styles.placeholderText}>
                    No ratings yet in the last few days. Share your QR code this shift!
                  </Text>
                ) : (
                  recentFeedback.map((ratingItem, index) => {
                    const submittedAt = new Date(ratingItem.timestamp);
                    const timeLabel = Number.isNaN(submittedAt.getTime())
                      ? ''
                      : `${submittedAt.toLocaleDateString()} ${submittedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                    return (
                      <View
                        key={ratingItem.id}
                        style={[
                          styles.feedbackRow,
                          index === recentFeedback.length - 1 && styles.feedbackRowLast,
                        ]}
                      >
                        <View style={styles.feedbackIconWrapper}>
                          <Ionicons
                            name={ratingItem.rating >= 4 ? 'star' : ratingItem.rating === 3 ? 'alert-circle' : 'warning'}
                            size={18}
                            color={ratingItem.rating >= 4 ? '#FFD700' : ratingItem.rating === 3 ? '#FF9800' : '#f44336'}
                          />
                        </View>
                        <View style={styles.feedbackContent}>
                          <Text style={styles.feedbackHeadline}>
                            {ratingItem.rating}⭐ {ratingItem.tableNumber ? `• ${ratingItem.tableNumber}` : ''}
                          </Text>
                          {ratingItem.comment ? (
                            <Text style={styles.feedbackComment} numberOfLines={2}>
                              “{ratingItem.comment}”
                            </Text>
                          ) : null}
                          <Text style={styles.feedbackMeta}>{timeLabel}</Text>
                        </View>
                      </View>
                    );
                  })
                )}
              </Card.Content>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card style={styles.settingsCard}>
            <Card.Content>
              <Title style={styles.cardTitle}>Settings</Title>
              
              <List.Item
                title="Push Notifications"
                description="Receive notifications for badges and achievements"
                left={(props) => <List.Icon {...props} icon="bell" />}
                right={() => (
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={setNotificationsEnabled}
                  />
                )}
              />
              
              <List.Item
                title="Sound Effects"
                description="Play sounds for achievements and notifications"
                left={(props) => <List.Icon {...props} icon="volume-high" />}
                right={() => (
                  <Switch
                    value={soundEnabled}
                    onValueChange={setSoundEnabled}
                  />
                )}
              />
              
              <List.Item
                title="Privacy Policy"
                description="View our privacy policy"
                left={(props) => <List.Icon {...props} icon="shield-account" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => Alert.alert('Privacy Policy', 'Privacy policy content would be displayed here.')}
              />
              
              <List.Item
                title="Terms of Service"
                description="View terms and conditions"
                left={(props) => <List.Icon {...props} icon="file-document" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => Alert.alert('Terms of Service', 'Terms of service content would be displayed here.')}
              />
            </Card.Content>
          </Card>
        </motion.div>

        {isManager && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Card style={styles.managerCard}>
              <Card.Content>
                <Title style={styles.cardTitle}>Manager Tools</Title>
                
                <List.Item
                  title="Staff Management"
                  description="Manage waiters and their performance"
                  left={(props) => <List.Icon {...props} icon="account-group" />}
                  right={(props) => <List.Icon {...props} icon="chevron-right" />}
                  onPress={() => Alert.alert('Staff Management', 'Staff management features would be available here.')}
                />
                
                <List.Item
                  title="Analytics Dashboard"
                  description="View detailed performance analytics"
                  left={(props) => <List.Icon {...props} icon="chart-line" />}
                  right={(props) => <List.Icon {...props} icon="chevron-right" />}
                  onPress={() => Alert.alert('Analytics', 'Analytics dashboard would be opened here.')}
                />
                
                <List.Item
                  title="Fraud Monitoring"
                  description="Review flagged ratings and suspicious activity"
                  left={(props) => <List.Icon {...props} icon="shield-alert" />}
                  right={(props) => <List.Icon {...props} icon="chevron-right" />}
                  onPress={() => Alert.alert('Fraud Monitoring', 'Fraud monitoring tools would be available here.')}
                />
              </Card.Content>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Card style={styles.aboutCard}>
            <Card.Content>
              <Title style={styles.cardTitle}>About</Title>
              <Paragraph style={styles.aboutText}>
                Hotel Gamification App v1.0.0
              </Paragraph>
              <Paragraph style={styles.aboutText}>
                Empowering hospitality staff through gamification and real-time feedback.
              </Paragraph>
              
              <View style={styles.contactInfo}>
                <List.Item
                  title="Support"
                  description="Get help and support"
                  left={(props) => <List.Icon {...props} icon="help-circle" />}
                  right={(props) => <List.Icon {...props} icon="chevron-right" />}
                  onPress={() => Alert.alert('Support', 'Support contact information would be displayed here.')}
                />
                
                <List.Item
                  title="Contact Us"
                  description="Send feedback or report issues"
                  left={(props) => <List.Icon {...props} icon="email" />}
                  right={(props) => <List.Icon {...props} icon="chevron-right" />}
                  onPress={() => Alert.alert('Contact Us', 'Contact form would be displayed here.')}
                />
              </View>
            </Card.Content>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          <Button
            mode="outlined"
            onPress={handleLogout}
            style={styles.logoutButton}
            contentStyle={styles.logoutButtonContent}
            icon="logout"
            textColor="#f44336"
          >
            Logout
          </Button>
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
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userRole: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 2,
  },
  userEmail: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginTop: 2,
  },
  content: {
    padding: 20,
  },
  statsCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  feedbackCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  settingsCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  managerCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  aboutCard: {
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  placeholderText: {
    color: '#777',
    fontSize: 13,
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  feedbackRowLast: {
    borderBottomWidth: 0,
  },
  feedbackIconWrapper: {
    marginRight: 10,
    marginTop: 2,
  },
  feedbackContent: {
    flex: 1,
  },
  feedbackHeadline: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  feedbackComment: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  feedbackMeta: {
    fontSize: 11,
    color: '#888',
  },
  aboutText: {
    color: '#666',
    marginBottom: 8,
  },
  contactInfo: {
    marginTop: 16,
  },
  logoutButton: {
    borderColor: '#f44336',
    marginTop: 20,
    borderRadius: 8,
  },
  logoutButtonContent: {
    paddingVertical: 8,
  },
});

export default ProfileScreen;
