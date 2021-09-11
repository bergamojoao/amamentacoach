import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import i18n from 'i18n-js';

import theme from '../config/theme';
import { useIsFirstRun } from '../contexts/firstRun';
import DiaryIntroduction from '../pages/Diary/DiaryIntroduction';
import DiaryMenu from '../pages/Diary/Menu';
import HomeMenu from '../pages/Home/Menu';
import ProfileMenu from '../pages/Profile/Menu';
import SurveyMenu from '../pages/Survey/Menu';

import DiaryIcon from '../../assets/images/icons/ic_diary_grey.svg';
import HomeIcon from '../../assets/images/icons/ic_home_grey.svg';
import ProfileIcon from '../../assets/images/icons/ic_profile_grey.svg';
import SurveyIcon from '../../assets/images/icons/ic_survey_grey.svg';

const TabNavigator: React.FC = () => {
  const { isFirstRun } = useIsFirstRun();
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.grey,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeMenu}
        options={{
          tabBarLabel: i18n.t('Begin'),
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <HomeIcon width={size} height={size} fill={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Diary"
        component={
          isFirstRun.persistent.diaryIntroduction
            ? DiaryIntroduction
            : DiaryMenu
        }
        options={{
          tabBarLabel: i18n.t('Diary'),
          headerShown: false,
          tabBarStyle: {
            display: isFirstRun.persistent.diaryIntroduction ? 'none' : 'flex',
          },
          tabBarIcon: ({ color, size }) => (
            <DiaryIcon height={size} width={size} fill={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Survey"
        component={SurveyMenu}
        options={{
          tabBarLabel: i18n.t('Surveys'),
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <SurveyIcon height={size} width={size} fill={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileMenu}
        options={{
          tabBarLabel: i18n.t('Profile'),
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <ProfileIcon height={size} width={size} fill={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
