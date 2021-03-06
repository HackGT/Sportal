import React, { Component } from 'react';
import { connect } from 'react-redux';
import Media from 'react-media';
import { Grid, Dimmer, Loader, Input, Button, Form, Pagination } from 'semantic-ui-react';
import ParticipantsTable from '../components/ParticipantsTable';
import ResumeView from '../components/ResumeView';
import { ACTION_UI_SEARCH_STRING, ACTION_UI_CHANGE_VIEW_MODE, ACTION_UI_DOWNLOAD_SHOW } from '../constants/actions';
import { selectParticipant, starParticipant, unstarParticipant, loadParticipants, changePage } from '../actions/participants';


class MainPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isResumeViewActive: false, // Used for mobile only
        };
    }
    
    render() {
        const participants = this.props.state.participants.list;
        const page = this.props.state.participants.page;
        const changePage = this.props.changePage;
        const isTableLoading = this.props.state.participants.isLoading;
        const viewMode = this.props.state.ui.viewMode;
        const selectedParticipantID = this.props.state.ui.selectedParticipantID;
        const selectedParticipantResumeType = this.props.state.ui.selectedParticipantResumeType;
        const selectedParticipantResumeURL = this.props.state.ui.selectedParticipantResumeURL;
        const selectParticipant = this.props.selectParticipant;
        const starParticipant = this.props.starParticipant;
        const unstarParticipant = this.props.unstarParticipant;
        const searchString = this.props.state.ui.searchTerm;
        const changeSearchString = this.props.changeSearchString;
        const changeViewMode = this.props.changeViewMode;
        const loadAllParticipants = this.props.loadAllParticipants;
        const loadStarredParticipants = this.props.loadStarredParticipants;
        const loadVisitedParticipants = this.props.loadVisitedParticipants;
        const loadSearchedParticipants = this.props.loadSearchedParticipants;
        const showDownloadModal = this.props.showDownloadModal;

        const leftColumn = (
            <div>
                <Dimmer active={isTableLoading} inverted>
                    <Loader size="medium">Loading</Loader>
                </Dimmer>
                <div style={{paddingLeft: '30px'}}>
                    <Form
                        onSubmit={() => {
                            loadSearchedParticipants(searchString);
                            changeViewMode('search');
                        }}
                    >
                        <Form.Field>
                            <Input
                                fluid
                                action="Search"
                                placeholder="Search for names, skills, etc. (eg. Java, React, John..)"
                                onChange={(e, data) => changeSearchString(data.value)} value={searchString}
                            />
                        </Form.Field>
                    </Form>
                    <div style={{paddingTop: '20px', display: 'flex', justifyContent: 'space-between'}}>
                        <div>
                            <Button.Group>
                                <Button
                                    primary={viewMode === 'all'}
                                    onClick={() => {
                                        loadAllParticipants();
                                        changeViewMode('all');
                                    }}
                                >
                                    All
                                </Button>
                                <Button
                                    primary={viewMode === 'star'}
                                    onClick={() => {
                                        loadStarredParticipants();
                                        changeViewMode('star');
                                    }}
                                >
                                    Starred
                                </Button>
                                <Button
                                    primary={viewMode === 'visit'}
                                    onClick={() => {
                                        loadVisitedParticipants();
                                        changeViewMode('visit')
                                    }}
                                >
                                    Visited
                                </Button>
                                {
                                    viewMode === 'search' && (
                                        <Button
                                            primary
                                        >
                                            Searching
                                        </Button>
                                    )
                                }
                            </Button.Group>
                        </div>
                        <div>
                            <Button
                                onClick={() => showDownloadModal()}
                            >
                                Bulk Download..
                            </Button>
                        </div>
                        
                    </div>
                    <div style={{paddingTop: '20px', textAlign: 'center'}}>
                        <Pagination
                            pointing
                            secondary
                            firstItem={null}
                            lastItem={null}
                            activePage={page}
                            totalPages={Math.ceil(participants.length / 8)}
                            onPageChange={(e, { activePage }) => changePage(activePage)}
                        />
                    </div>
                    <ParticipantsTable
                        participants={participants.slice((page - 1) * 8, page * 8)}
                        selectedParticipantID={selectedParticipantID}
                        selectParticipant={(participant) => {
                            this.setState({isResumeViewActive: true});
                            selectParticipant(participant);
                        }}
                        starParticipant={starParticipant}
                        unstarParticipant={unstarParticipant}
                    />
                </div>      
            </div>             
        );

        const rightColumn = (
            <div>
                <ResumeView
                    selectedParticipantID={selectedParticipantID}
                    selectedParticipantResumeType={selectedParticipantResumeType}
                    selectedParticipantResumeURL={selectedParticipantResumeURL}
                />
            </div>
        );
        
        
        return (
            <Grid>
                <Media query="(max-width: 1000px)">
                    {
                        matches => 
                            matches ? (
                                <Grid.Row columns={1}>
                                    {
                                        !this.state.isResumeViewActive ? (
                                            <Grid.Column>
                                                {leftColumn}
                                            </Grid.Column>
                                        ) : (
                                            <Grid.Column>
                                                <div><Button basic icon="close" onClick={() => this.setState({isResumeViewActive: false})} /></div>
                                                {rightColumn}
                                            </Grid.Column>
                                        )
                                    }
                                </Grid.Row>
                            ) : (
                                <Grid.Row columns={2}>
                                    <Grid.Column>
                                        {leftColumn}
                                    </Grid.Column>
                                    <Grid.Column>
                                        {rightColumn}
                                    </Grid.Column>
                                </Grid.Row>
                            )
                    }
                </Media>
            </Grid>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        state: state
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        selectParticipant: (participant) => {
            dispatch(selectParticipant(participant));
        },
        starParticipant: (id) => {
            dispatch(starParticipant(id));
        },
        unstarParticipant: (id) => {
            dispatch(unstarParticipant(id));
        },
        changeSearchString: (searchTerm) => {
            dispatch({
                type: ACTION_UI_SEARCH_STRING,
                payload: {
                    searchTerm
                }
            })
        },
        changeViewMode: (mode) => {
            dispatch({
                type: ACTION_UI_CHANGE_VIEW_MODE,
                payload: {
                    viewMode: mode
                }
            });
        },
        loadAllParticipants: () => {
            dispatch(loadParticipants({}))
        },
        loadStarredParticipants: () => {
            dispatch(loadParticipants({star: true}))
        },
        loadVisitedParticipants: () => {
            dispatch(loadParticipants({nfc: true}))
        },
        loadSearchedParticipants: (searchTerm) => {
            // If searching empty string, show all participants
            if (searchTerm === '') {
                dispatch(loadParticipants({}))
            } else {
                dispatch(loadParticipants({search: searchTerm}));
            }
        },
        showDownloadModal: () => {
            dispatch({
                type: ACTION_UI_DOWNLOAD_SHOW
            });
        },
        changePage: (page) => {
            dispatch(changePage(page));
        }
    };
};

const ConnectedMainPage = connect(
    mapStateToProps,
    mapDispatchToProps
)(MainPage);

export default ConnectedMainPage;