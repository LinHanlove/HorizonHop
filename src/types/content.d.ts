declare namespace TYPE {
  /**
   * @type 监听来自popup的消息
   */
  interface ListenerMessageOption {
    origin: string;
    type: string;
    data: any;
  }
}