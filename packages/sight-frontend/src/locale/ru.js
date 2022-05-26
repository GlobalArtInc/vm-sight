// import en from 'vuetify/es5/locale/en'
export default {
    label: 'Русский',
    //page login
    login: 'Вход',
    register: 'Регистрация',
    username: 'Имя пользователя',
    password: 'Пароль',
    login_account: 'Вход в учетную запись',
    //
    create: 'Создать',
    update: 'Обновить',
    cancel: 'Отмена',
    create_endpoint: 'Добавить сервер',
    update_endpoint: 'Обновить сервер',
    //app drawer
    sponsor: 'Спонсор',
    information: 'Информация',
    types: {
        agent: 'Agent',
        docker: 'Docker',
        docker_socket: 'Docker (через сокет)',
        kubernetos: 'Kubernetos'
    },
    containers: {
        started: 'Контейнер запущен',
        stopped: 'Контейнер остановлен',
        killed: 'Контейнер убит',
        restarted: 'Контейнер перезапущен',
        paused: 'Контейнер на паузе',
        resumes: 'Контейнер возобновлен',
        removed: 'Контейнер удален',
        renamed: 'Контейнер переименован'
    },
    // user page
    yes: 'Да',
    no: 'Нет',
    name: 'Имя',
    endpoints: {
        edit: 'Редактировать сервер',
        host: 'Хост',
        public_url: 'Адрес сервера',
        logs: 'Логи',
        inspect: 'Изучить',
        stats: 'Статистика',
        console: 'Консоль',
        attach: 'Attach'
    },
    user: {
        username: 'Имя пользователя',
        password: 'Пароль',
        repeatPassword: 'Повторите пароль',
        administrator: 'Администратор',
        oauth2_identity: 'OAuth2 идентификатор',
        created: 'Пользователь создан',
        updated: 'Пользователь обновлен'
    },
    endpointsCreate: 'Новый сервер',
    endpointsEdit: 'Редактировать сервер',
    usersCreate: 'Новый пользователь',
    usersEdit: 'Редактировать пользователя',
    endpoint_already_exists: 'Сервер уже существует',
    errors: { field_is_required: 'Обязательное поле' },
    networks: {
        details: 'Информация о сети',
        options: 'Настройки сети',
        containers: 'Контейнеры в сети',
        disconnected: 'Сеть отключена',
        connected: 'Сеть подключена'
    },
    // menu
    menu: {
        home: 'Главная',
        dashboard: 'Панель',
        endpoints: 'Серверы',
        settings: 'Настройки',
        settings_auth: 'Настройки аутентификации',
        docker: 'Docker',
        containers: 'Контейнеры',
        edit: 'Редактировать',
        users: 'Пользователи',
        usersCreate: 'Новый пользователь',
        usersEdit: 'Редактировать пользователя',
        endpointsEdit: 'Редактировать сервер',
        endpointsCreate: 'Новый сервер',
        list: 'Список',
        registries: 'Registries',
        logs: 'Логи',
        exec: 'Консоль',
        attach: 'Подключиться',
        images: 'Образы',
        imageEdit: 'Редактировать образ',
        networks: 'Сети',
        networksList: 'Список сетей',
        networksAdd: 'Новая сеть',
        networksEdit: 'Редактирование сети',
        dockerDashboard: 'Docker панель',
        containersList: 'Список контейнеров'
    },
    //media
    media: 'Медиа',
    // rules
    rule: { required: 'Поле {0} обязательно' }
};