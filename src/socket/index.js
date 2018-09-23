
import io from 'socket.io-client';

// config
import { socket_url } from '../../config';

// redux actions
import { loadUnreadCount, cancelNotiaction } from '../actions/notification';
import { setOnlineUserCount } from '../actions/website';
import { newPostsTips } from '../actions/posts';

export default ({ dispatch, getState }) => {

  let socket = io.connect(socket_url);

  const handleAction = (fn, params = null) => fn(params)(dispatch, getState);

  socket.on('connect', function(){

    console.log('socket.io 连接成功');

    // 更新在线用户
    this.on("online-user-count", count => handleAction(setOnlineUserCount, count));

    // 通知
    this.on("notiaction", (userIds) => {
      const me = getState().user.profile;
      if (me && me._id && userIds.indexOf(me._id) != -1) handleAction(loadUnreadCount);
    });

    // 取消通知
    this.on("cancel-notiaction", id => handleAction(cancelNotiaction, {id}));

    // 最帖子通知
    this.on("new-posts", timestamp => handleAction(newPostsTips));

  });

  // 断开了连接事件
  socket.on('disconnect', () => {
    console.log('socket.io 断开了');
  });

}
