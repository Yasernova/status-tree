/* eslint-disable react/destructuring-assignment */
import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    window.postMessage(error);
    return { hasError: true };
  }



  render() {
    if (this.state.hasError) {
      return <h1 className="e-b">
        حدث خطأ ما
        حدث خطأ ما
        حدث خطأ ما
        حدث خطأ ما
        حدث خطأ ما
        حدث خطأ ما
        حدث خطأ ما
        حدث خطأ ما
        حدث خطأ ما
        حدث خطأ ما
        حدث خطأ ما
        حدث خطأ ما
        حدث خطأ ما
        حدث خطأ ما
        حدث خطأ ما
        </h1>;
    }

    return this.props.children;
  }
}
