import React from "react";

const Context = React.createContext();

export const ContextProvider = props => {
  return (
    <Context.Provider
      value={{
				lang: props.lang,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export function withLocalization(Component) {
  return function LocalizedComponent(props) {
    return (
      <Context.Consumer>
        {context => {
          return (
            <Component
              {...props}
              lang={context.lang}
            />
          );
        }}
      </Context.Consumer>
    );
  };
}
