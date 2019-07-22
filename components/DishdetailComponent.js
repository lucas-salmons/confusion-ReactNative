import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Button, Modal, StyleSheet } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';

import { connect } from 'react-redux';
import { postFavorite, postComment } from '../redux/ActionCreators';
import { baseUrl } from '../shared/baseUrl';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}
const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment, id) => dispatch(postComment(dishId, rating, author, comment, id))
})

const RenderDish = (props) => {

    const dish = props.dish;

    if (dish != null) {
        return (
            <Card
                featuredTitle={dish.name}
                image={{ uri: baseUrl + dish.image }}>
                <Text style={{ margin: 10 }}>
                    {dish.description}
                </Text>
                <View style={styles.cardRow}>
                    <Icon
                        raised
                        reverse
                        name={props.favorite ? 'heart' : 'heart-o'}
                        type='font-awesome'
                        color='#f50'
                        onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                    />
                    <Icon
                        style={styles.cardItem}
                        raised
                        reverse
                        name={'pencil'}
                        type='font-awesome'
                        color='#512DA8'
                        onPress={() => props.onshowModal()}
                    />
                </View>
            </Card>
        );
    }
    else {
        return (<View></View>);
    }
}

const RenderComments = (props) => {
    const comments = props.comments;

    const renderCommentItem = ({ item, index }) => {
        return (
            <View key={index} style={{ margin: 10 }}>
                <Text style={{ fontSize: 14 }}>{item.comment}</Text>
                <Rating
                    style={{ alignSelf: 'flex-start' }}
                    imageSize={12}
                    startingValue={+[item.rating]}
                    readonly
                />
                <Text style={{ fontSize: 12 }}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };

    return (
        <Card title='Comments'>
            <FlatList
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id.toString()}
            />
        </Card>
    );
}

class DishDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            favorites: [],
            showModal: false,
            rating: 5,
            author: '',
            comment: ''
        };
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    toggleModal() {
        this.setState(prevState => ({
            showModal: !prevState.showModal
        }));
    }
    handleComment = (dishId) => {
        const id = this.props.comments.comments.length;
        this.props.postComment(dishId, this.state.rating, this.state.author, this.state.comment, id);
        this.toggleModal();
    }

    resetForm() {
        this.setState({
            showModal: false,
            rating: 5,
            author: '',
            comment: ''
        });
    }

    render() {
        const dishId = this.props.navigation.getParam('dishId', '');

        return (
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)}
                    onshowModal={() => this.toggleModal()}
                />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.showModal}
                    onDismiss={() => this.toggleModal()}
                    onRequestClose={() => this.toggleModal()}>
                    <View style={styles.modal}>
                        <Rating
                            showRating
                            defaultRating={this.state.rating}
                            startingValue={this.state.rating}
                            onFinishRating={(rating) => this.setState({ rating: rating })} />
                        <Input
                            placeholder=' Author'
                            leftIcon={
                                <Icon
                                    name='user-o'
                                    type='font-awesome'
                                    color='black'
                                />
                            }
                            onChangeText={(author) => this.setState({ author: author })}
                        />
                        <Input
                            placeholder=' Comment'
                            leftIcon={
                                <Icon
                                    name='comment-o'
                                    type='font-awesome'
                                    color='black'
                                />
                            }
                            onChangeText={(comment) => this.setState({ comment: comment })}
                        />
                        <View style={{ marginTop: 10 }}>
                            <Button
                                onPress={() => { this.handleComment(dishId); this.resetForm(); }}
                                title='submit'
                                color='#512DA8'
                            />
                        </View>
                        <View style={{ marginTop: 10 }}>
                            <Button
                                onPress={() => { this.toggleModal(); this.resetForm(); }}
                                title='cancel'
                                color='grey'
                            />
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    cardRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    cardItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);