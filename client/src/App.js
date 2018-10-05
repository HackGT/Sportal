import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dimmer, Loader, Modal, Header, Icon, Button } from 'semantic-ui-react';
import ConnectedNavbar from './containers/Navbar';
import ConnectedMainPage from './containers/MainPage';
import ConnectedLoginPage from './containers/LoginPage';
import { ACTION_UI_ERROR_HIDE, ACTION_UI_DOWNLOAD_HIDE } from './constants/actions';

class App extends Component {
  render() {
    return (
      <div>
        <Modal
          open={this.props.isErrorModalActive}
          onClose={() => this.props.hideError()}
          basic
          size="small"
        >
          <Header icon="browser" content="Error"/>
          <Modal.Content>
            <h3>{this.props.errorModalMessage}</h3>
          </Modal.Content>
        </Modal>
        <Modal
          open={this.props.isDownloadModalActive}
          onClose={() => this.props.hideDownload()}
          size="small"
        >
          <Header icon="browser" content="Download" />
          <Modal.Content>
            Your file has been prepared. Click the button below to begin download.
          </Modal.Content>
          <Modal.Actions>
            <a href={this.props.downloadURL} target="_blank">
              <Button
                primary
              >
                Download
              </Button>
            </a>
          </Modal.Actions>
        </Modal>
        <ConnectedNavbar />
        <div>
          <Dimmer active={this.props.isGlobalLoaderActive} inverted>
            <Loader size="large">Loading</Loader>
          </Dimmer>
          {
            this.props.isLoggedIn ? <ConnectedMainPage /> : <ConnectedLoginPage />
          }
        </div>
        <div style={{textAlign: 'center', paddingTop: '10px'}}>
            Made with <Icon name="heart" color="red" /> by HackGT
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
      isGlobalLoaderActive: state.ui.isGlobalLoaderActive,
      isLoggedIn: state.user.isLoggedIn,
      isErrorModalActive: state.ui.isErrorModalActive,
      errorModalMessage: state.ui.errorModalMessage,
      isDownloadModalActive: state.ui.isDownloadModalActive,
      downloadURL: state.ui.downloadURL
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    hideError: () => {
      dispatch({
        type: ACTION_UI_ERROR_HIDE
      });
    },
    hideDownload: () => {
      dispatch({
        type: ACTION_UI_DOWNLOAD_HIDE
      });
    }
  };
};

const ConnectedApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

export default ConnectedApp;
