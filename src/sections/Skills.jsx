import React, { useState, useEffect } from 'react';
import { skillsAPI } from '../api/axios';
import FormField from '../components/FormField';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../hooks/useToast';
import Loader from '../components/Loader';
import '../styles/section.css';
import { formatFileSize } from '../utils/helpers';

// Category options matching your enum
// const CATEGORY_OPTIONS = [
//   { value: 'Frontend', label: 'Frontend' },
//   { value: 'Backend', label: 'Backend' },
//   { value: 'Database', label: 'Database' },
//   { value: 'Tools', label: 'Tools' },
//   { value: 'Other', label: 'Other' }
// ];
const CATEGORY_OPTIONS = [
  { value: 'Frontend', label: 'Frontend' },
  { value: 'Backend', label: 'Backend' },
  { value: 'Database', label: 'Database' },
  { value: 'DevOps & Cloud', label: 'DevOps & Cloud' },
  { value: 'Programming Languages', label: 'Programming Languages' },
  { value: 'Tools', label: 'Tools' },
  { value: 'Mobile Development', label: 'Mobile Development' },
  { value: 'Testing', label: 'Testing' },
  { value: 'Design & UI/UX', label: 'Design & UI/UX' },
  { value: 'Data Science & AI', label: 'Data Science & AI' },
  { value: 'Blockchain', label: 'Blockchain' },
  { value: 'Game Development', label: 'Game Development' },
  { value: 'CMS & E-commerce', label: 'CMS & E-commerce' },
  { value: 'Other', label: 'Other' }
];

// Level options
const LEVEL_OPTIONS = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
  { value: 'Expert', label: 'Expert' }
];

// Common icon URLs for skills (optional pre-filled suggestions)
// const COMMON_ICONS = {
//   'Frontend': [
//     { name: 'React', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/react.svg' },
//     { name: 'Vue.js', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/vuedotjs.svg' },
//     { name: 'Angular', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/angular.svg' },
//     { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/javascript.svg' },
//     { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/typescript.svg' },
//     { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/html5.svg' },
//     { name: 'CSS3', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/css3.svg' },
//     { name: 'Sass', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/sass.svg' },
//     { name: 'Tailwind CSS', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/tailwindcss.svg' },
//   ],
//   'Backend': [
//     { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/nodedotjs.svg' },
//     { name: 'Express', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/express.svg' },
//     { name: 'Python', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/python.svg' },
//     { name: 'Django', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/django.svg' },
//     { name: 'Java', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/java.svg' },
//     { name: 'Spring', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/spring.svg' },
//     { name: 'PHP', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/php.svg' },
//     { name: 'Laravel', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/laravel.svg' },
//     { name: 'Ruby', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/ruby.svg' },
//     { name: 'Rails', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/rubyonrails.svg' },
//     { name: 'Go', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/go.svg' },
//   ],
//   'Database': [
//     { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/mongodb.svg' },
//     { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/mysql.svg' },
//     { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/postgresql.svg' },
//     { name: 'Redis', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/redis.svg' },
//     { name: 'SQLite', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/sqlite.svg' },
//     { name: 'Firebase', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/firebase.svg' },
//   ],
//   'Tools': [
//     { name: 'Git', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/git.svg' },
//     { name: 'GitHub', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/github.svg' },
//     { name: 'Docker', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/docker.svg' },
//     { name: 'AWS', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/amazonaws.svg' },
//     { name: 'Azure', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/microsoftazure.svg' },
//     { name: 'Heroku', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/heroku.svg' },
//     { name: 'Nginx', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/nginx.svg' },
//     { name: 'Webpack', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/webpack.svg' },
//     { name: 'Vite', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/vite.svg' },
//   ],
//   'Other': [
//     { name: 'Figma', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/figma.svg' },
//     { name: 'Photoshop', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/adobephotoshop.svg' },
//     { name: 'Illustrator', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/adobeillustrator.svg' },
//     { name: 'Linux', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/linux.svg' },
//   ]
// };
const COMMON_ICONS = {
  'Frontend': [
    { name: 'React', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/react.svg' },
    { name: 'Vue.js', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/vuedotjs.svg' },
    { name: 'Angular', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/angular.svg' },
    { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/javascript.svg' },
    { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/typescript.svg' },
    { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/html5.svg' },
    { name: 'CSS3', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/css3.svg' },
    { name: 'Sass', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/sass.svg' },
    { name: 'Tailwind CSS', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/tailwindcss.svg' },
    { name: 'Bootstrap', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/bootstrap.svg' },
    { name: 'Material UI', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/mui.svg' },
    { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/nextdotjs.svg' },
    { name: 'Nuxt.js', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/nuxtdotjs.svg' },
    { name: 'Svelte', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/svelte.svg' },
    { name: 'jQuery', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/jquery.svg' },
    { name: 'Redux', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/redux.svg' },
    { name: 'Vite', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/vite.svg' },
    { name: 'Webpack', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/webpack.svg' },
    { name: 'Babel', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/babel.svg' },
    { name: 'GraphQL', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/graphql.svg' },
    { name: 'Three.js', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/threedotjs.svg' },
    { name: 'D3.js', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/d3dotjs.svg' },
  ],
  'Backend': [
    { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/nodedotjs.svg' },
    { name: 'Express', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/express.svg' },
    { name: 'Python', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/python.svg' },
    { name: 'Django', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/django.svg' },
    { name: 'Flask', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/flask.svg' },
    { name: 'FastAPI', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/fastapi.svg' },
    { name: 'Java', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/java.svg' },
    { name: 'Spring', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/spring.svg' },
    { name: 'PHP', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/php.svg' },
    { name: 'Laravel', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/laravel.svg' },
    { name: 'Symfony', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/symfony.svg' },
    { name: 'Ruby', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/ruby.svg' },
    { name: 'Rails', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/rubyonrails.svg' },
    { name: 'Go', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/go.svg' },
    { name: 'Gin', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/gin.svg' },
    { name: 'Rust', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/rust.svg' },
    { name: 'Actix', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/actix.svg' },
    { name: 'C++', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/cplusplus.svg' },
    { name: 'C#', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/csharp.svg' },
    { name: '.NET', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/dotnet.svg' },
    { name: 'ASP.NET', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/dotnet.svg' },
    { name: 'Kotlin', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/kotlin.svg' },
    { name: 'Scala', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/scala.svg' },
    { name: 'Deno', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/deno.svg' },
    { name: 'NestJS', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/nestjs.svg' },
    { name: 'Apollo', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/apollographql.svg' },
  ],
  'Database': [
    { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/mongodb.svg' },
    { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/mysql.svg' },
    { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/postgresql.svg' },
    { name: 'SQLite', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/sqlite.svg' },
    { name: 'Redis', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/redis.svg' },
    { name: 'Firebase', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/firebase.svg' },
    { name: 'Supabase', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/supabase.svg' },
    { name: 'Cassandra', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/apachecassandra.svg' },
    { name: 'MariaDB', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/mariadb.svg' },
    { name: 'Oracle', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/oracle.svg' },
    { name: 'SQL Server', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/microsoftsqlserver.svg' },
    { name: 'Elasticsearch', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/elasticsearch.svg' },
    { name: 'Neo4j', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/neo4j.svg' },
    { name: 'DynamoDB', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/amazondynamodb.svg' },
    { name: 'CouchDB', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/apachecouchdb.svg' },
    { name: 'InfluxDB', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/influxdb.svg' },
    { name: 'CockroachDB', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/cockroachlabs.svg' },
    { name: 'Prisma', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/prisma.svg' },
    { name: 'Sequelize', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/sequelize.svg' },
    { name: 'Mongoose', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/mongoose.svg' },
  ],
  'DevOps & Cloud': [
    { name: 'Docker', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/docker.svg' },
    { name: 'Kubernetes', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/kubernetes.svg' },
    { name: 'AWS', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/amazonaws.svg' },
    { name: 'Azure', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/microsoftazure.svg' },
    { name: 'Google Cloud', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/googlecloud.svg' },
    { name: 'DigitalOcean', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/digitalocean.svg' },
    { name: 'Heroku', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/heroku.svg' },
    { name: 'Netlify', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/netlify.svg' },
    { name: 'Vercel', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/vercel.svg' },
    { name: 'Render', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/render.svg' },
    { name: 'Jenkins', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/jenkins.svg' },
    { name: 'GitHub Actions', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/githubactions.svg' },
    { name: 'GitLab', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/gitlab.svg' },
    { name: 'CircleCI', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/circleci.svg' },
    { name: 'Travis CI', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/travisci.svg' },
    { name: 'Ansible', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/ansible.svg' },
    { name: 'Terraform', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/terraform.svg' },
    { name: 'Pulumi', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/pulumi.svg' },
    { name: 'Nginx', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/nginx.svg' },
    { name: 'Apache', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/apache.svg' },
    { name: 'Linux', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/linux.svg' },
    { name: 'Ubuntu', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/ubuntu.svg' },
    { name: 'CentOS', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/centos.svg' },
    { name: 'Debian', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/debian.svg' },
    { name: 'Prometheus', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/prometheus.svg' },
    { name: 'Grafana', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/grafana.svg' },
    { name: 'Sentry', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/sentry.svg' },
  ],
  'Programming Languages': [
    { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/javascript.svg' },
    { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/typescript.svg' },
    { name: 'Python', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/python.svg' },
    { name: 'Java', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/java.svg' },
    { name: 'C++', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/cplusplus.svg' },
    { name: 'C#', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/csharp.svg' },
    { name: 'Go', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/go.svg' },
    { name: 'Rust', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/rust.svg' },
    { name: 'PHP', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/php.svg' },
    { name: 'Ruby', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/ruby.svg' },
    { name: 'Swift', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/swift.svg' },
    { name: 'Kotlin', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/kotlin.svg' },
    { name: 'Dart', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/dart.svg' },
    { name: 'Scala', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/scala.svg' },
    { name: 'R', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/r.svg' },
    { name: 'Julia', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/julia.svg' },
    { name: 'Haskell', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/haskell.svg' },
    { name: 'Elixir', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/elixir.svg' },
    { name: 'Clojure', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/clojure.svg' },
    { name: 'Perl', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/perl.svg' },
    { name: 'Lua', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/lua.svg' },
  ],
  'Tools': [
    { name: 'Git', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/git.svg' },
    { name: 'GitHub', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/github.svg' },
    { name: 'GitLab', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/gitlab.svg' },
    { name: 'Bitbucket', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/bitbucket.svg' },
    { name: 'VS Code', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/visualstudiocode.svg' },
    { name: 'IntelliJ IDEA', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/intellijidea.svg' },
    { name: 'WebStorm', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/webstorm.svg' },
    { name: 'PyCharm', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/pycharm.svg' },
    { name: 'Android Studio', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/androidstudio.svg' },
    { name: 'Xcode', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/xcode.svg' },
    { name: 'Sublime Text', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/sublimetext.svg' },
    { name: 'Atom', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/atom.svg' },
    { name: 'Postman', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/postman.svg' },
    { name: 'Swagger', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/swagger.svg' },
    { name: 'Jira', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/jira.svg' },
    { name: 'Confluence', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/confluence.svg' },
    { name: 'Slack', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/slack.svg' },
    { name: 'Discord', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/discord.svg' },
    { name: 'Notion', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/notion.svg' },
    { name: 'Trello', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/trello.svg' },
    { name: 'npm', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/npm.svg' },
    { name: 'Yarn', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/yarn.svg' },
    { name: 'pnpm', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/pnpm.svg' },
    { name: 'Homebrew', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/homebrew.svg' },
    { name: 'Chrome DevTools', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/googlechrome.svg' },
    { name: 'Firefox', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/firefox.svg' },
  ],
  'Mobile Development': [
    { name: 'React Native', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/react.svg' },
    { name: 'Flutter', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/flutter.svg' },
    { name: 'Android', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/android.svg' },
    { name: 'iOS', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/ios.svg' },
    { name: 'Swift', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/swift.svg' },
    { name: 'Kotlin', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/kotlin.svg' },
    { name: 'Ionic', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/ionic.svg' },
    { name: 'Xamarin', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/xamarin.svg' },
    { name: 'Expo', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/expo.svg' },
  ],
  'Testing': [
    { name: 'Jest', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/jest.svg' },
    { name: 'Mocha', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/mocha.svg' },
    { name: 'Chai', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/chai.svg' },
    { name: 'Cypress', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/cypress.svg' },
    { name: 'Selenium', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/selenium.svg' },
    { name: 'Playwright', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/playwright.svg' },
    { name: 'Puppeteer', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/puppeteer.svg' },
    { name: 'Testing Library', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/testinglibrary.svg' },
    { name: 'JUnit', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/junit5.svg' },
    { name: 'PHPUnit', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/php.svg' },
    { name: 'Vitest', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/vitest.svg' },
    { name: 'Postman', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/postman.svg' },

  ],
  'Design & UI/UX': [
    { name: 'Figma', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/figma.svg' },
    { name: 'Adobe XD', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/adobexd.svg' },
    { name: 'Sketch', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/sketch.svg' },
    { name: 'Photoshop', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/adobephotoshop.svg' },
    { name: 'Illustrator', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/adobeillustrator.svg' },
    { name: 'InDesign', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/adobeindesign.svg' },
    { name: 'Canva', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/canva.svg' },
    { name: 'Zeplin', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/zeplin.svg' },
    { name: 'InVision', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/invision.svg' },
    { name: 'Blender', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/blender.svg' },
  ],
  'Data Science & AI': [
    { name: 'TensorFlow', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/tensorflow.svg' },
    { name: 'PyTorch', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/pytorch.svg' },
    { name: 'Keras', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/keras.svg' },
    { name: 'NumPy', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/numpy.svg' },
    { name: 'Pandas', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/pandas.svg' },
    { name: 'Jupyter', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/jupyter.svg' },
    { name: 'Scikit-learn', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/scikitlearn.svg' },
    { name: 'OpenCV', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/opencv.svg' },
    { name: 'R', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/r.svg' },
    { name: 'Tableau', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/tableau.svg' },
    { name: 'Power BI', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/powerbi.svg' },
    { name: 'Apache Spark', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/apachespark.svg' },
    { name: 'Hadoop', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/apachehadoop.svg' },
    { name: 'Airflow', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/apacheairflow.svg' },
  ],
  'Blockchain': [
    { name: 'Ethereum', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/ethereum.svg' },
    { name: 'Solidity', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/solidity.svg' },
    { name: 'Web3.js', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/web3dotjs.svg' },
    { name: 'Hardhat', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/hardhat.svg' },
    { name: 'Truffle', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/truffle.svg' },
    { name: 'IPFS', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/ipfs.svg' },
    { name: 'Polygon', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/polygon.svg' },
    { name: 'Binance', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/binance.svg' },
  ],
  'Game Development': [
    { name: 'Unity', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/unity.svg' },
    { name: 'Unreal Engine', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/unrealengine.svg' },
    { name: 'Godot', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/godotengine.svg' },
    { name: 'Blender', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/blender.svg' },
    { name: 'Three.js', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/threedotjs.svg' },
    { name: 'C#', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/csharp.svg' },
    { name: 'C++', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/cplusplus.svg' },
  ],
  'CMS & E-commerce': [
    { name: 'WordPress', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/wordpress.svg' },
    { name: 'Shopify', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/shopify.svg' },
    { name: 'WooCommerce', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/woocommerce.svg' },
    { name: 'Magento', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/magento.svg' },
    { name: 'Drupal', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/drupal.svg' },
    { name: 'Joomla', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/joomla.svg' },
    { name: 'Contentful', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/contentful.svg' },
    { name: 'Sanity', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/sanity.svg' },
    { name: 'Strapi', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/strapi.svg' },
  ]
};

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [editingSkill, setEditingSkill] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState(null);
  const [bulkMode, setBulkMode] = useState(false);
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    level: '',
    iconUrl: ''
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await skillsAPI.getAll();
      // Ensure we always get an array, even if response.data is undefined
      setSkills(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch skills:', error);
      showError('Failed to load skills');
      setSkills([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    const updatedFormData = { ...formData, [field]: value };
    
    // Auto-suggest icon URL when skill name is entered
    if (field === 'name' && value && updatedFormData.category) {
      const categoryIcons = COMMON_ICONS[updatedFormData.category] || [];
      const matchingIcon = categoryIcons.find(icon => 
        icon.name.toLowerCase() === value.toLowerCase()
      );
      if (matchingIcon && !updatedFormData.iconUrl) {
        updatedFormData.iconUrl = matchingIcon.icon;
      }
    }
    
    // Clear icon suggestions when category changes
    if (field === 'category' && value && updatedFormData.name) {
      const categoryIcons = COMMON_ICONS[value] || [];
      const matchingIcon = categoryIcons.find(icon => 
        icon.name.toLowerCase() === updatedFormData.name.toLowerCase()
      );
      if (matchingIcon && !updatedFormData.iconUrl) {
        updatedFormData.iconUrl = matchingIcon.icon;
      }
    }
    
    setFormData(updatedFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingSkill) {
        const response = await skillsAPI.update(editingSkill._id, formData);
        setSkills(prev => prev.map(s => 
          s._id === editingSkill._id ? response.data : s
        ));
        showSuccess('Skill updated successfully');
      } else {
        const response = await skillsAPI.create(formData);
        setSkills(prev => [...prev, response.data]);
        showSuccess('Skill added successfully');
      }
      
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error('Failed to save skill:', error);
      showError('Failed to save skill');
    }
  };

  const handleBulkCreate = async () => {
    if (!formData.name || !formData.category) {
      showError('Please enter skill name and category');
      return;
    }

    const skillNames = formData.name.split('\n')
      .map(name => name.trim())
      .filter(name => name);
    
    const categories = formData.category.split('\n')
      .map(cat => cat.trim())
      .filter(cat => cat);
    
    const levels = formData.level ? 
      formData.level.split('\n')
        .map(lvl => lvl.trim())
        .filter(lvl => lvl) : 
      [];

    const bulkData = skillNames.map((name, index) => {
      const category = categories[index] || categories[0] || 'Other';
      const level = levels[index] || levels[0] || 'Intermediate';
      
      // Auto-suggest icon
      let iconUrl = '';
      const categoryIcons = COMMON_ICONS[category] || [];
      const matchingIcon = categoryIcons.find(icon => 
        icon.name.toLowerCase() === name.toLowerCase()
      );
      if (matchingIcon) {
        iconUrl = matchingIcon.icon;
      }

      return {
        name,
        category,
        level,
        iconUrl
      };
    });

    try {
      const response = await skillsAPI.bulkCreate(bulkData);
      setSkills(prev => [...prev, ...(Array.isArray(response.data) ? response.data : [])]);
      showSuccess(`${bulkData.length} skills created successfully`);
      resetForm();
      setBulkMode(false);
    } catch (error) {
      console.error('Failed to bulk create skills:', error);
      showError('Failed to create skills');
    }
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name || '',
      category: skill.category || '',
      level: skill.level || '',
      iconUrl: skill.iconUrl || ''
    });
    setShowForm(true);
    setBulkMode(false);
  };

  const handleDelete = async () => {
    if (!skillToDelete) return;
    
    try {
      await skillsAPI.delete(skillToDelete._id);
      setSkills(prev => prev.filter(s => s._id !== skillToDelete._id));
      showSuccess('Skill deleted successfully');
    } catch (error) {
      console.error('Failed to delete skill:', error);
      showError('Failed to delete skill');
    } finally {
      setSkillToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      level: '',
      iconUrl: ''
    });
    setEditingSkill(null);
  };

  // Group skills by category for better display
  const groupedSkills = skills.reduce((groups, skill) => {
    const category = skill.category || 'Other';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(skill);
    return groups;
  }, {});

  const getLevelColor = (level) => {
    if (!level) return '#9e9e9e';
    
    switch(level.toLowerCase()) {
      case 'beginner': return '#4caf50'; // Green
      case 'intermediate': return '#ff9800'; // Orange
      case 'advanced': return '#2196f3'; // Blue
      case 'expert': return '#9c27b0'; // Purple
      default: return '#9e9e9e'; // Grey
    }
  };

  if (loading) {
    return <Loader text="Loading skills..." />;
  }

  return (
    <div className="section-container">
      <div className="section-header">
        <h1>Skills Management</h1>
        <p>Manage your technical and professional skills</p>
      </div>

      <div className="section-content">
        <div className="section-actions">
          <button 
            className="btn-secondary"
            onClick={() => {
              setBulkMode(!bulkMode);
              setShowForm(false);
              resetForm();
            }}
          >
            {bulkMode ? 'Single Mode' : 'Bulk Mode'}
          </button>
          <button 
            className="btn-primary"
            onClick={() => {
              setBulkMode(false);
              setShowForm(true);
              resetForm();
            }}
          >
            + Add New Skill
          </button>
        </div>

        {bulkMode ? (
          <div className="form-card">
            <h2>Bulk Create Skills</h2>
            <p className="helper-text">Enter skill names (one per line) and optionally categories/levels (also one per line).</p>
            
            <FormField
              label="Skill Names (one per line)"
              value={formData.name}
              onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
              multiline
              rows={6}
              placeholder="React\nVue.js\nTypeScript\nNode.js\nMongoDB"
              helperText="Each line will become a separate skill"
            />
            
            <FormField
              label="Categories (one per line, optional)"
              value={formData.category}
              onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              multiline
              rows={3}
              placeholder="Frontend\nFrontend\nFrontend\nBackend\nDatabase"
              helperText="Match each skill with a category, or use first category for all"
            />
            
            <FormField
              label="Levels (one per line, optional)"
              value={formData.level}
              onChange={(value) => setFormData(prev => ({ ...prev, level: value }))}
              multiline
              rows={3}
              placeholder="Advanced\nIntermediate\nAdvanced\nAdvanced\nIntermediate"
              helperText="Match each skill with a level, or use first level for all"
            />
            
            <div className="form-actions">
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => setBulkMode(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn-primary"
                onClick={handleBulkCreate}
              >
                Create All Skills
              </button>
            </div>
          </div>
        ) : showForm && (
          <div className="form-card">
            <h2>{editingSkill ? 'Edit Skill' : 'Add New Skill'}</h2>
            
            <form onSubmit={handleSubmit}>
              <FormField
                label="Skill Name"
                value={formData.name}
                onChange={(value) => handleInputChange('name', value)}
                required
                placeholder="e.g., React, Node.js, MongoDB"
              />
              
              <div className="grid-2">
                <FormField
                  label="Category"
                  type="select"
                  value={formData.category}
                  onChange={(value) => {handleInputChange('category', value)}}
                  options={CATEGORY_OPTIONS}
                  required
                />
                
                <FormField
                  label="Proficiency Level"
                  type="select"
                  value={formData.level}
                  onChange={(value) => handleInputChange('level', value)}
                  options={LEVEL_OPTIONS}
                  placeholder="Select level"
                />
              </div>
              
              <FormField
                label="Icon URL (Optional)"
                type="url"
                value={formData.iconUrl}
                onChange={(value) => handleInputChange('iconUrl', value)}
                placeholder="https://example.com/icon.svg"
                helperText={
                  <span>
                    URL to skill icon (e.g., from <a href="https://simpleicons.org/" target="_blank" rel="noopener noreferrer">Simple Icons</a>). 
                    We'll auto-suggest based on skill name.
                  </span>
                }
              />
              
              {formData.name && formData.category && COMMON_ICONS[formData.category] && (
                <div className="icon-suggestions">
                  <p className="helper-text">Suggested icons for {formData.category}:</p>
                  <div className="icon-grid">
                    {COMMON_ICONS[formData.category]
                      .filter(icon => icon.name.toLowerCase().includes(formData.name.toLowerCase()) || 
                                     formData.name.toLowerCase().includes(icon.name.toLowerCase()))
                      .slice(0, 5)
                      .map((icon, index) => (
                        <button
                          key={index}
                          type="button"
                          className={`icon-suggestion ${formData.iconUrl === icon.icon ? 'selected' : ''}`}
                          onClick={() => handleInputChange('iconUrl', icon.icon)}
                        >
                          <img src={icon.icon} alt={icon.name} />
                          <span>{icon.name}</span>
                        </button>
                      ))
                    }
                  </div>
                </div>
              )}
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                >
                  {editingSkill ? 'Update Skill' : 'Add Skill'}
                </button>
              </div>
            </form>
          </div>
        )}

        {Object.keys(groupedSkills).length > 0 ? (
          <div className="skills-by-category">
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category} className="category-section">
                <h2 className="category-title">
                  {category} <span className="category-count">({categorySkills.length})</span>
                </h2>
                <div className="skills-grid">
                  {categorySkills.map((skill) => (
                    <div key={skill._id || skill.id} className="skill-card">
                      <div className="skill-header">
                        {skill.iconUrl ? (
                          <img 
                            src={skill.iconUrl} 
                            alt={skill.name} 
                            className="skill-icon"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              const fallback = e.target.nextElementSibling;
                              if (fallback) {
                                fallback.style.display = 'flex';
                              }
                            }}
                          />
                        ) : null}
                        <div 
                          className="skill-icon-fallback"
                          style={{ display: skill.iconUrl ? 'none' : 'flex' }}
                        >
                          {skill.name ? skill.name.charAt(0) : '?'}
                        </div>
                        <div className="skill-info">
                          <h3 className="skill-name">{skill.name}</h3>
                          {skill.level && (
                            <span 
                              className="skill-level"
                              style={{ backgroundColor: getLevelColor(skill.level) }}
                            >
                              {skill.level}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="skill-meta">
                        <span className="meta-item">
                          <span className="meta-label">Category:</span> {skill.category}
                        </span>
                        <span className="meta-item">
                          <span className="meta-label">Added:</span> {
                            skill.createdAt || skill.updatedAt 
                              ? new Date(skill.createdAt || skill.updatedAt).toLocaleDateString()
                              : 'N/A'
                          }
                        </span>
                      </div>
                      
                      <div className="skill-actions">
                        <button 
                          className="btn-edit"
                          onClick={() => handleEdit(skill)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn-delete"
                          onClick={() => {
                            setSkillToDelete(skill);
                            setShowDeleteModal(true);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          !showForm && (
            <div className="empty-state">
              <div className="empty-icon">⚡</div>
              <h3>No Skills Yet</h3>
              <p>Add your skills to showcase your expertise</p>
              <button 
                className="btn-primary"
                onClick={() => {
                  setBulkMode(false);
                  setShowForm(true);
                }}
              >
                Add First Skill
              </button>
            </div>
          )
        )}
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Skill"
        message="Are you sure you want to delete this skill? This action cannot be undone."
        confirmText="Delete Skill"
      />
    </div>
  );
};

export default Skills;
