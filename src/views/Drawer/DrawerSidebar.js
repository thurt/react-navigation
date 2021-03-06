/* @flow */

import React, { PureComponent } from 'react';
import {
  Platform,
  StyleSheet,
  View,
} from 'react-native';

import withCachedChildNavigation from '../../withCachedChildNavigation';

import type {
  NavigationScreenProp,
  NavigationState,
  NavigationAction,
  NavigationRouter,
} from '../../TypeDefinition';

import type {
  DrawerScene,
} from './DrawerView';

type Navigation = NavigationScreenProp<NavigationState, NavigationAction>;

type Props = {
  router: NavigationRouter,
  navigation: Navigation,
  childNavigationProps: { [key: string]: Navigation },
  contentComponent: ReactClass<*>,
  contentOptions?: {},
  style?: any;
};

/**
 * Component that renders child screen of the drawer.
 */
class DrawerSidebar extends PureComponent<void, Props, void> {
  props: Props;

  _getScreenConfig = (routeKey: string, configName: string) => {
    const DrawerScreen = this.props.router.getComponentForRouteName('DrawerClose');
    return DrawerScreen.router.getScreenConfig(
      this.props.childNavigationProps[routeKey],
      configName
    );
  }

  _getLabelText = ({ route }: DrawerScene) => {
    const drawer = this._getScreenConfig(route.key, 'drawer');
    if (drawer && typeof drawer.label === 'string') {
      return drawer.label;
    }

    const title = this._getScreenConfig(route.key, 'title');
    if (typeof title === 'string') {
      return title;
    }

    return route.routeName;
  };

  _renderIcon = ({ focused, tintColor, route }: DrawerScene) => {
    const drawer = this._getScreenConfig(route.key, 'drawer');
    if (drawer && drawer.icon) {
      return drawer.icon({
        tintColor,
        focused,
      });
    }
    return null;
  };

  render() {
    const ContentComponent = this.props.contentComponent;
    return (
      <View style={[styles.container, this.props.style]}>
        <ContentComponent
          {...this.props.contentOptions}
          navigation={this.props.navigation}
          getLabelText={this._getLabelText}
          renderIcon={this._renderIcon}
        />
      </View>
    );
  }
}

export default withCachedChildNavigation(DrawerSidebar);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
});
