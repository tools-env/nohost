import React, { Component } from 'react';
import { Icon, Button, Modal, message } from 'antd';
import Administrator from './component/administrator';
import Domain from './component/domain';
import TokenSetting from './component/tokenSetting';
import Panel from '../../components/panel';
import { getActiveTabFromHash, setActiveHash } from '../util';
import { getAdministratorSettings, restart } from '../cgi';
import './index.css';
import Tabs from '../../components/tab';

/* eslint-disable no-alert */
const { TabPane } = Tabs;
class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = { activeKey: getActiveTabFromHash('administrator') };
  }

  componentDidMount() {
    getAdministratorSettings(this.setState.bind(this));
  }

  // 切换页面时，重置二级菜单为默认值
  static getDerivedStateFromProps(props) {
    if (props.hide === true) {
      return {
        activeKey: 'administrator',
      };
    }
    return null;
  }

  handleClick = activeKey => {
    this.setState({
      activeKey,
    });
    setActiveHash(activeKey);
  };

  restart = () => {
    const self = this;
    if (self.restarting) {
      return;
    }
    self.restarting = true;
    self.setState({});
    Modal.confirm({
      title: '确定重启服务？',
      onOk() {
        restart((data) => {
          if (data && data.ec === 0) {
            message.success('重启成功。');
          } else {
            message.error('重启失败！');
          }
          setTimeout(() => {
            self.restarting = false;
            self.setState({});
          }, 3000);
        });
      },
      onCancel() {
        self.restarting = false;
        self.setState({});
      },
    });
  }

  render() {
    const { hide = false } = this.props;
    const {
      activeKey,
      admin,
      domain,
      ec,
      token,
    } = this.state;

    if (ec !== 0) {
      return null;
    }
    return (
      <div className={`box p-settings ${hide ? ' p-hide' : ''}`}>
        <Tabs defaultActiveKey="administrator" onChange={this.handleClick} activeKey={activeKey}>
          <TabPane
            tab={(
              <span>
                <Icon type="user" />
                  管理员
              </span>
            )}
            tabKey="administrator"
          >
            <Administrator value={admin} />
          </TabPane>
          <TabPane
            tab={(
              <span>
                <Icon type="global" />
                设置域名
              </span>
            )}
            tabKey="domain"
          >
            <Domain value={domain} />
          </TabPane>
          <TabPane
            tab={(
              <span>
                <Icon type="setting" />
                设置Token
              </span>
            )}
            tabKey="tokenSetting"
          >
            <TokenSetting value={token} />
          </TabPane>
          <TabPane
            tab={(
              <span>
                <Icon type="redo" />
                重启操作
              </span>
            )}
            tabKey="restart"
          >
            <div className="p-mid-con">
              <Panel title="重启操作">
                <Button type="danger" disabled={this.restarting} onClick={this.restart}>重启</Button>
              </Panel>
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default Settings;
