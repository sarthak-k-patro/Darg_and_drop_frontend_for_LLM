import React from "react";
import { Link } from "react-router-dom";
import styles from "./ErrorBoundary.module.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service here
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.container}>
          <div className={styles.errorBox}>
            <h1 className={styles.title}>
              <i>Oops! Something went wrong.</i>
            </h1>
            <p className={styles.message}>
              An unexpected error has occurred. <b>We are on it.</b>
            </p>
            <div className={styles.actions}>
              <button onClick={this.handleRetry} className={styles.button}>
                Refresh the page
              </button>
              <Link
                to="https://www.youtube.com/watch?v=WWS0uj-ed8U"
                className={styles.link}
              >
                Meanwhile, you can learn more about: VectorShift Platform
                Overview | No Code
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
