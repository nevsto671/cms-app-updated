declare module 'react-router-dom' {
  export interface BrowserRouterProps {
    children?: React.ReactNode;
  }
  
  export class BrowserRouter extends React.Component<BrowserRouterProps, any> {}
}