import React from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';

const DatesBrowserContext = React.createContext({});

export class DatesBrowser extends React.Component {
  static propTypes = {};
  static defaultProps = {
    stateReducer: (state, changes) => changes,
    onStateChange: () => {},
  };
  static stateChangeTypes = {};
  static Consumer = DatesBrowserContext.Consumer;
  initialState = {};
  state = this.initialState;
  isControlledProp(key) {
    return this.props[key] !== undefined;
  }
  getState(stateToMerge = this.state) {
    return Object.keys(stateToMerge).reduce((state, key) => {
      state[key] = this.isControlledProp(key)
        ? this.props[key]
        : stateToMerge[key];
      return state;
    }, {});
  }
  internalSetState = (changes, callback = () => {}) => {
    let allChanges;
    this.setState(
      currentState => {
        const combinedState = this.getState(currentState);
        return [changes]
          .map(c => (typeof c === 'function' ? c(currentState) : c))
          .map(c => {
            allChanges = this.props.stateReducer(combinedState, c) || {};
            return allChanges;
          })
          .map(({ type: ignoredType, ...onlyChanges }) => onlyChanges)
          .map(c => {
            return Object.keys(combinedState).reduce((newChanges, stateKey) => {
              if (!this.isControlledProp(stateKey)) {
                newChanges[stateKey] = c.hasOwnProperty(stateKey)
                  ? c[stateKey]
                  : combinedState[stateKey];
              }
              return newChanges;
            }, {});
          })
          .map(c => (Object.keys(c || {}).length ? c : null))[0];
      },
      () => {
        this.props.onStateChange(allChanges, this.state);
        callback();
      },
    );
  };
  render() {
    const { children } = this.props;
    const ui = typeof children === 'function' ? children(this.state) : children;
    return (
      <DatesBrowserContext.Provider value={this.state}>
        {ui}
      </DatesBrowserContext.Provider>
    );
  }
}

export function withDatesBrowser(Component) {
  const Wrapper = React.forwardRef((props, ref) => {
    return (
      <DatesBrowser.Consumer>
        {browserUtils => (
          <Component {...props} dataBrowser={browserUtils} ref={ref} />
        )}
      </DatesBrowser.Consumer>
    );
  });
  Wrapper.displayName = `withDatesBrowser(${Component.displayName ||
    Component.name})`;
  hoistNonReactStatics(Wrapper, Component);
  return Wrapper;
}
