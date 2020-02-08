/* @flow */
import React, { PureComponent } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { MAX_TIME } from '../common/Constant';

type Props = {
  finish: Function,
  time: Number,
  style: Object,
  extraTextStyle: Object,
  notStartTimerText?: String,
  endTimerText?: String,
};

export default class CountdownCom extends PureComponent<Props> {
  static defaultProps = {
    notStartTimerText: '',
    endTimerText: '',
  }

  constructor(props) {
    super(props);
    const {
      time, notStartTimerText, noMax,
    } = this.props;
    let text = '';
    let isEnd = false;
    const diff = time - Date.now() / 1000;
    const noTimer = (diff > MAX_TIME || diff < 1) && !noMax;
    if (diff > MAX_TIME && !noMax) {
      text = notStartTimerText;
    } else if (diff < 1) {
      isEnd = true;
    } else {
      text = this.formatTime(diff || 0);
    }
    noTimer || this.start(time);
    this.state = {
      text, isEnd,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { time } = this.props;
    if (time !== nextProps.time) {
      setTimeout(() => this.start(nextProps.time));
    }
  }

  componentWillUnmount() {
    this.clear();
  }

  clear = () => {
    this.timeInterval && clearInterval(this.timeInterval);
  }

  start = (time) => {
    this.clear();
    const { noMax } = this.props;
    if (time - Date.now() / 1000 < MAX_TIME || noMax) {
      this.timeInterval = setInterval(() => {
        const diff = time - Date.now() / 1000;
        if (diff < 1) {
          this.finish();
        } else {
          this.setState({ text: this.formatTime(diff), isEnd: false });
        }
      }, 1000);
    }
  }

  finish = () => {
    const { finish } = this.props;
    finish && finish();
    this.clear();
    this.setState({ isEnd: true });
  }

  formatTime = (timer) => {
    const dd = parseInt(timer / 3600 / 24).toString().padStart(2, 0);
    const hh = parseInt(timer / 3600).toString().padStart(2, 0);
    const mm = parseInt((timer % 3600) / 60).toString().padStart(2, 0);
    const ss = parseInt(timer % 60).toString().padStart(2, 0);
    return 'hh : mm : ss'.replace('dd', dd).replace('hh', hh).replace('mm', mm).replace('ss', ss);
  }

  render() {
    const {
      style, extraTextStyle, format, endStyle, endTimerText,
    } = this.props;
    const { text, isEnd } = this.state;
    const extraText = format.split('time');
    const leftText = extraText[0];
    const rightText = extraText[1];
    if (isEnd) {
      return <Text style={[endStyle || style, { bottom: -1 }]}>{endTimerText}</Text>;
    }
    return (
      <View style={styles.container}>
        {!!leftText && <Text style={extraTextStyle || style}>{leftText}</Text>}
        <Text style={style}>{text}</Text>
        {!!rightText && <Text style={extraTextStyle || style}>{rightText}</Text>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    bottom: -1,
  },
});
