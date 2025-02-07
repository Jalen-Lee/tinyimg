use objc2::{declare_class, msg_send_id, mutability, rc::Id, ClassType, DeclaredClass};
use objc2_app_kit::{
    NSApplication, NSPasteboard, NSPasteboardTypeFileURL, NSUpdateDynamicServices,
};
use objc2_foundation::{run_on_main, NSError, NSObject, NSString, NSURL};

use std::{
    ffi::CStr,
    path::PathBuf,
    str,
    sync::{Arc, Mutex},
};

use crate::Inspect;

// 声明一个名为 ContextMenu 的类
declare_class!(
    #[derive(Debug)]
    struct ContextMenu;

    // 实现 ClassType trait，指定父类为 NSObject，类的不可变性，并命名为 "PicSharp_ContextMenu"
    unsafe impl ClassType for ContextMenu {
        type Super = NSObject;
        type Mutability = mutability::Immutable;
        const NAME: &'static str = "PicSharp_ContextMenu";
    }

    // 为 ContextMenu 实现 DeclaredClass trait，定义一个类型为 Arc<Mutex<Inspect>> 的实例变量
    impl DeclaredClass for ContextMenu {
        type Ivars = Arc<Mutex<Inspect>>;
    }

    // 实现 ContextMenu 的方法
    unsafe impl ContextMenu {
        // 定义一个名为 inspect_credentials 的方法，用于处理粘贴板中的文件路径
        #[method(nsCompress:userData:error:)]
        unsafe fn inspect_credentials(
            &self,
            pasteboard: *mut NSPasteboard,
            _user_data: *mut NSString,
            _error: *mut *mut NSError
        ) {

            log::info!("user_data: {:?}", (*_user_data).UTF8String());
            // 获取 Inspect 实例的锁
            let mut inspect = self.ivars().lock().unwrap();
            // 从粘贴板中获取文件路径
            match (*pasteboard).stringForType(NSPasteboardTypeFileURL) {
                Some(path) => {
                    log::info!("path1: {:?}", path);
                    // 将路径标准化
                    match NSURL::fileURLWithPath(&path).standardizedURL() {
                        Some(path) => {
                            // 获取路径字符串
                            match path.path() {
                                Some(path) => {
                                    let path = CStr::from_ptr(path.UTF8String());
                                    // 将 C 字符串转换为 Rust 字符串
                                    match str::from_utf8(path.to_bytes()) {
                                        Ok(path) => {
                                            // 记录路径信息
                                            log::info!("path: {:?}", path);

                                            // 发送路径信息，如果失败则记录错误
                                            if let Err(err) = inspect.send(PathBuf::from(path)) {
                                                inspect.error(err);
                                            }
                                        }
                                        Err(err) => {
                                            // 记录字符串转换错误
                                            inspect.error(err);
                                        }
                                    }
                                }
                                None => inspect.error_string("Failed to read path from context menu because: path does not conform to RFC 1808 or the file no longer exists".to_owned())
                            }
                        }
                        None => inspect.error_string("Failed to read path from context menu because path does not conform to RFC 1808".to_owned())
                    }
                }
                None => inspect.error_string("Failed to read path from context menu".to_owned())
            }
        }
    }
);

// 为 ContextMenu 实现一个初始化方法
impl ContextMenu {
    fn init_with(inspect: Arc<Mutex<Inspect>>) -> Id<Self> {
        // 分配内存并设置实例变量
        let this = Self::alloc().set_ivars(inspect);
        // 调用父类的初始化方法
        unsafe { msg_send_id![super(this), init] }
    }
}

// 定义一个加载函数，用于设置服务提供者
pub fn load(inspect: Arc<Mutex<Inspect>>) {
    unsafe {
        // 在主线程上运行
        run_on_main(move |mtm| {
            // 设置应用程序的服务提供者为 ContextMenu
            NSApplication::sharedApplication(mtm)
                .setServicesProvider(Some(&ContextMenu::init_with(inspect)));

            // 更新动态服务
            NSUpdateDynamicServices();
        });
    }
}
