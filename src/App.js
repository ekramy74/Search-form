import './App.css';
import {Button, Col, Empty, FloatButton, Form, Input, notification, Row, Skeleton, Tooltip} from "antd";
import {SearchActionTypes, SearchInitialState, SearchReducer} from "./Search/SearchReducer";
import {useCallback, useReducer} from "react";
import {APIRequest} from "./lib/APIRequest";

function App() {
    const [form] = Form.useForm();
    const [searchState, searchDispatch] = useReducer(SearchReducer, SearchInitialState)
    const getResults = useCallback((values) => {
            if (Object.values(values).every((item) => item === '' || item === undefined)) {
                notification.warning({
                    message: 'Warning',
                    description: 'Please fill at least one field to search',
                    duration: 2,
                    placement: 'topRight',
                })
                return;
            }
            searchDispatch({type: SearchActionTypes.SET_LOADING, payload: true})
            const body = {
                fname: values?.fname || '',
                mname: values?.mname || '',
                lname: values?.lname || '',
                nat: values?.nat || '',
            }
            APIRequest('integration/focal/screen/individual', 'POST', body, (res) => {
                    searchDispatch({type: SearchActionTypes.SET_RESULTS, payload: res.data.screen_result})
                },
                (error) => {
                    searchDispatch({type: SearchActionTypes.SET_LOADING, payload: false})
                    notification.error({
                        message: 'Error',
                        description: error?.data?.error || 'Something went wrong, please try again later',
                        duration: 2,
                        placement: 'topRight',
                    })
                })
        },
        [])
    const clearForm = () => {
        form.resetFields();
        searchDispatch({type: SearchActionTypes.CLEAR_RESULTS})
    }

    return (
        <div className="App">
            <div className={'header'}>
                <h3>Search</h3>
                <p className={'slogan'}> Find all you want in one place, fill the search fields to get into the
                    point. </p>
                <div className={'search-card'}>
                    <h4>Search by:</h4>
                    <Form form={form} layout={'vertical'}>
                        <Row gutter={24}>
                            <Col lg={6} md={10} sm={24}>
                                <Form.Item label={'First name'} name={'fname'}>
                                    <Input size={'small'}/>
                                </Form.Item>
                            </Col>
                            <Col lg={6} md={10} sm={24}>
                                <Form.Item label={'Middle name'} name={'mname'}>
                                    <Input size={'small'}/>
                                </Form.Item>
                            </Col>
                            <Col lg={6} md={10} sm={24}>
                                <Form.Item label={'Last name'} name={'lname'}>
                                    <Input size={'small'}/>
                                </Form.Item>
                            </Col>
                            <Col lg={6} md={10} sm={24}>
                                <Form.Item label={'Nationality/Country'} name={'nat'}>
                                    <Input size={'small'}/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <div className={'divider'}/>
                        <div className={'form-btns'}>
                            <Button type={'primary'} size={'small'}
                                    onClick={() => getResults(form.getFieldsValue())}>Search</Button>
                            <Button type={'default'} size={'small'} onClick={() => clearForm()}>Clear</Button>
                        </div>
                    </Form>
                </div>
            </div>

            <div className={'search-results'}>
                <div className={'results'}>
                    {searchState.loading ?
                        <div className={'skeleton'}>
                            <Skeleton active/>
                            <Skeleton active/>
                            <Skeleton active/>
                        </div>
                        :
                        searchState.results.length > 0 ?
                            searchState.results.map((item, index) => {
                                return (
                                    <div className={'card'} key={index}>
                                        <div className={'card-header'}>
                                            <div className={'name'}>
                                                <Tooltip placement={'top'} title={item?.name}>
                                                    <p>{item?.name || '-'}</p>
                                                </Tooltip>
                                                <span>score:
                                                <span className={'score'}>{item?.score || '0'}</span>
                                            </span>
                                            </div>

                                        </div>
                                        <div className={'card-body'}>
                                            <div className={'card-body-item'}>
                                                <p>Nationality:</p>
                                                <span>{item?.nationality || '-'}</span>
                                            </div>
                                            <div className={'card-body-item'}>
                                                <p>Place of birth:</p>
                                                <span>{item?.places_of_birth || '-'}</span>
                                            </div>
                                            <div className={'card-body-item'}>
                                                <p>Description:</p>
                                                <span>{item?.descriptions || '-'}</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                            :
                            <div className={'no-results'}>
                                <Empty description={'No results found, Or you haven\'t enter any search values'}/>
                            </div>
                    }
                </div>
            </div>
            <FloatButton.BackTop className={'backToTop'}/>
        </div>
    );
}

export default App;
