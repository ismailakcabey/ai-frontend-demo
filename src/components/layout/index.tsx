import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Divider, Drawer, MenuProps, Row, Typography } from 'antd'
import { Layout, Menu } from 'antd'
import './index.scss'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft2, ArrowRight2, CloseCircle, HambergerMenu, Setting } from 'iconsax-react'

const { Content, Sider } = Layout
type layoutProps = {
    children: JSX.Element
}
type MenuItem = Required<MenuProps>['items'][number]

const App = ({ children }: layoutProps) => {
    const [isSliderCollapsed, setIsSliderCollapsed] = useState(false)
    const [open, setOpen] = useState(false);
    //@ts-ignore
    const navigate = useNavigate()
    const intervalRef = React.useRef<number>();
    const location = useLocation()
    const menuStyle = {
        height: 44,
        marginBottom: 12,
        paddingLeft: 10,
        borderRadius: 4,
        padding: 10,
    }


    const menuItems: MenuItem[] = [
        {
            label: 'Main Page',
            key: '/',
            icon: <></>,
            disabled: false,
            style: menuStyle
        },
        {
            label: 'Conversation History',
            key: '/oldconverstations',
            icon: <></>,
            disabled: false,
            style: menuStyle
        },
        {
            label: 'Unknow Words',
            key: '/unknownwords',
            icon: <></>,
            disabled: false,
            style: menuStyle
        },
        {
            label: 'My Datas',
            key: '/reports',
            icon: <></>,
            disabled: false,
            style: menuStyle
        },
        {
            label: 'My Eyes',
            key: '/eyes',
            icon: <></>,
            disabled: false,
            style: menuStyle
        },
    ]
    const handleMenuScroll = () => {
        // Menü (Sider) kaydırıldığında yapılacak işlemler
        const menuElement = document.getElementById('sliderMenu'); // Menü elementinin ID'si ile alınması
        //@ts-ignore
        const isBottom = menuElement.scrollTop + menuElement.clientHeight >= menuElement.scrollHeight;

        if (isBottom) {
            loadMoreMessages()
            // Yeni mesajları yükleme fonksiyonunu çağır
            // Örneğin: loadMoreMessages();
        }
    };
    useEffect(() => {
        const menuElement = document.getElementById('sliderMenu'); // Menü elementinin ID'si ile alınması

        if (menuElement) {
            menuElement.addEventListener('scroll', handleMenuScroll);

            // Komponentin unmount edilmesi durumunda olay dinleyicisini kaldır
            return () => {
                menuElement.removeEventListener('scroll', handleMenuScroll);
            };
        }
    }, []);
    const loadMoreMessages = () => {
        console.log('yeni mesajlar')
        // Burada yeni mesajları yükleme işlemlerini gerçekleştirin
        // Örneğin: API çağrısı veya state güncellemesi
    };
    const onClick: MenuProps['onClick'] = useCallback(
        (e: any) => {
            console.log(e?.key)
            navigate(e?.key)
        },
        [navigate]
    )
    const handleDefaultValue = useMemo(() => {
        return [location.pathname === '/' ? '/' : location.pathname]
    }, [location.pathname])

    useEffect(() => {
        // Her component mount olduğunda bir interval oluştur
        intervalRef.current = setInterval(() => {

        }, 3000);

        // Component unmount olduğunda interval'i temizle
        return () => {
            clearInterval(intervalRef.current);
        };
    }, []);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    return (
        <Layout hasSider style={{ backgroundColor: '#fff' }}>
            <div onClick={showDrawer} className='md:hidden cursor-pointer'>
                <HambergerMenu />
            </div>
            <Drawer
                title={
                    <div className='flex flex-row justify-between'>
                        <div>Header</div>
                        <div onClick={onClose} className='cursor-pointer'><CloseCircle /></div>
                    </div>
                }
                placement="top"
                closable={false}
                onClose={onClose}
                open={open}
                key="top"
            >
                <Menu
                    mode="inline"
                    onClick={onClick}
                    defaultSelectedKeys={handleDefaultValue}
                    // items={items}
                    style={{
                        borderInlineEnd: 'none',
                        width: isSliderCollapsed ? 50 : '100%',
                    }}
                    id='sliderMenu'
                    className='h-full overflow-y-auto'
                    items={menuItems}
                />
            </Drawer>
            <Sider
                className='max-md:hidden'
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    backgroundColor: '#fff',
                    borderRight: '1px solid #e8e8e8',
                    padding: '4px'
                }}
                collapsed={isSliderCollapsed}
                width={236}
                collapsedWidth={106}
            >
                {<div
                    style={{
                        borderInlineEnd: 'none',
                        width: isSliderCollapsed ? 50 : '85%',
                        height: 44,
                        marginBottom: 12,
                        paddingLeft: 10,
                        borderRadius: 4,
                        padding: 10,
                    }}
                    className="hover:bg-[#EAECF0] justify-center flex cursor-pointer"
                >
                    {isSliderCollapsed ? (
                        <>
                            <ArrowRight2
                                color="#75759D"
                                onClick={() => {
                                    setIsSliderCollapsed(!isSliderCollapsed)
                                }}
                            />
                        </>
                    ) : (
                        <>
                            <ArrowLeft2
                                color="#75759D"
                                onClick={() => {
                                    setIsSliderCollapsed(!isSliderCollapsed)
                                }}
                            />
                        </>
                    )}
                </div>}
                <Menu
                    mode="inline"
                    onClick={onClick}
                    defaultSelectedKeys={handleDefaultValue}
                    // items={items}
                    style={{
                        borderInlineEnd: 'none',
                        width: isSliderCollapsed ? 50 : '100%',
                    }}
                    id='sliderMenu'
                    className='h-full overflow-y-auto'
                    items={menuItems}
                />
                <div
                    className={'user-menu bg-white'}
                    style={{
                        width: isSliderCollapsed ? 86 : 216,
                    }}
                >
                    <Divider style={{ margin: 0, borderTop: '2px solid #EAECF0' }} />
                    <Row
                        className='items-center my-5 justify-center'
                    >
                        <div className='cursor-pointer hover:bg-gray-100 hover:p-2 rounded-lg flex flex-col items-center justify-center'><Setting /></div>
                    </Row>
                </div>
            </Sider>

            <Layout className={``} style={{ backgroundColor: 'transparent' }}>
                <Content className={`${isSliderCollapsed ? " ml-[106px] " : " ml-[236px] "} max-md:ml-[0px]`} style={{
                }}>{children}</Content>
            </Layout>
        </Layout>
    )
}

export default App