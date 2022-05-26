// import en from 'vuetify/es5/locale/en'
export default {
    label: 'Русский',
    //page login
    login: 'Вход',
    logout: 'Выйти',
    register: 'Регистрация',
    username: 'Имя пользователя',
    password: 'Пароль',
    login_account: 'Вход в учетную запись',
    // labels
    labels: { language: 'Язык' },
    //
    create: 'Создать',
    update: 'Обновить',
    cancel: 'Отмена',
    create_endpoint: 'Добавить сервер',
    update_endpoint: 'Обновить сервер',
    //app drawer
    sponsor: 'Спонсор',
    information: 'Информация',
    info: 'Инфо',
    types: {
        agent: 'Agent',
        docker: 'Docker',
        docker_socket: 'Docker (через сокет)',
        kubernetos: 'Kubernetos'
    },
    docker: { swarm_warn: 'VM-SIGHT is connected to a node that is part of a Swarm cluster. Some resources located on other nodes in the cluster might not be available for management.' },
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
        attach: 'Подключиться к контейнеру'
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
        endpoint: 'Endpoint',
        endpoints: 'Сервера',
        settings: 'Настройки',
        settings_auth: 'Аутентификация',
        docker: 'Docker',
        containers: 'Контейнеры',
        edit: 'Редактировать',
        users: 'Пользователи',
        usersCreate: 'Новый пользователь',
        usersEdit: 'Редактировать пользователя',
        endpointsEdit: 'Редактировать сервер',
        endpointsCreate: 'Новый сервер',
        list: 'Список',
        registries: 'Репозитории',
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