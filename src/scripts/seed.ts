import 'dotenv/config';
import { mkdirSync } from 'fs';
import path from 'path';
import { DataSource } from 'typeorm';
import { SQLiteCommentEntity } from '../modules/comments/infrastructure/entities/comment.sqlite.entity';
import { SQLiteNotificationEntity } from '../modules/notifications/infrastructure/entities/notification.sqlite.entity';
import { NotificationType } from '../modules/notifications/domain/entities/notification.entity';
import { SQLitePostEntity } from '../modules/posts/infrastructure/entities/post.sqlite.entity';
import { SQLiteSubscriptionEntity } from '../modules/subscriptions/infrastructure/entities/subscription.sqlite.entity';
import { SQLiteTagEntity } from '../modules/tags/infrastructure/entities/tag.sqlite.entity';
import { SQLiteUserEntity } from '../modules/users/infrastructure/entities/user.sqlite.entity';

type SeedUser = {
  id: string;
  username: string;
  role: 'user' | 'writer' | 'moderator' | 'admin';
  password: string;
};

type SeedTag = {
  id: string;
  name: string;
  createdAt: Date;
};

type SeedPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'draft' | 'waiting' | 'accepted' | 'rejected';
  authorId: string;
  tagIds: string[];
};

const databasePath =
  process.env.DATABASE_URL ?? path.join(process.cwd(), 'db', 'app.sqlite');

type SeedNotification = {
  id: string;
  recipientId: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string;
  isRead: boolean;
  createdAt: Date;
  metadata: Record<string, unknown>;
};

const seedUsers: SeedUser[] = [
  {
    id: 'reader_user',
    username: 'reader_user',
    role: 'user',
    password: 'password123',
  },
  {
    id: 'writer_user',
    username: 'writer_user',
    role: 'writer',
    password: 'password123',
  },
  {
    id: 'moderator_user',
    username: 'moderator_user',
    role: 'moderator',
    password: 'password123',
  },
  {
    id: 'admin_user',
    username: 'admin_user',
    role: 'admin',
    password: 'password123',
  },
];

const seedTags: SeedTag[] = [
  {
    id: 'tag-typescript-1',
    name: 'typescript',
    createdAt: new Date('2026-04-09T00:00:00.000Z'),
  },
  {
    id: 'tag-nodejs-2',
    name: 'nodejs',
    createdAt: new Date('2026-04-09T00:01:00.000Z'),
  },
  {
    id: 'tag-javascript-3',
    name: 'javascript',
    createdAt: new Date('2026-04-09T00:02:00.000Z'),
  },
  {
    id: 'tag-nestjs-4',
    name: 'nestjs',
    createdAt: new Date('2026-04-09T00:03:00.000Z'),
  },
  {
    id: 'tag-architecture-5',
    name: 'architecture',
    createdAt: new Date('2026-04-09T00:04:00.000Z'),
  },
];

const seedPosts: SeedPost[] = [
  {
    id: 'post-draft-1',
    title: 'My Draft Article',
    slug: 'my-draft-article',
    content: 'This is a draft...',
    status: 'draft',
    authorId: 'writer_user',
    tagIds: ['tag-typescript-1', 'tag-nestjs-4'],
  },
  {
    id: 'post-pending-review-1',
    title: 'Article Pending Review',
    slug: 'article-pending-review',
    content: 'Waiting for approval...',
    status: 'waiting',
    authorId: 'writer_user',
    tagIds: ['tag-nodejs-2', 'tag-architecture-5'],
  },
  {
    id: 'post-accepted-1',
    title: 'Published Article',
    slug: 'published-article',
    content: 'This is published...',
    status: 'accepted',
    authorId: 'writer_user',
    tagIds: ['tag-typescript-1', 'tag-javascript-3'],
  },
  {
    id: 'post-rejected-1',
    title: 'Rejected Article',
    slug: 'rejected-article',
    content: 'This was rejected...',
    status: 'rejected',
    authorId: 'writer_user',
    tagIds: ['tag-javascript-3'],
  },
];

const seedComments = [
  {
    id: 'comment-1',
    content: 'Good perspective on the topic.',
    authorId: 'reader_user',
    postId: 'post-accepted-1',
    createdAt: new Date('2026-04-09T00:10:00.000Z'),
    updatedAt: new Date('2026-04-09T00:10:00.000Z'),
  },
  {
    id: 'comment-2',
    content: 'Useful reference for the team.',
    authorId: 'admin_user',
    postId: 'post-accepted-1',
    createdAt: new Date('2026-04-09T00:11:00.000Z'),
    updatedAt: new Date('2026-04-09T00:11:00.000Z'),
  },
];

const seedSubscriptions = [
  {
    followerId: 'reader_user',
    followingId: 'writer_user',
    createdAt: new Date('2026-04-09T00:12:00.000Z'),
  },
];

const seedNotifications: SeedNotification[] = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    recipientId: 'moderator_user',
    type: NotificationType.POST_PENDING_REVIEW,
    title: 'Action Required',
    message: 'New post pending review: "My Draft Article"',
    link: 'my-draft-article',
    isRead: false,
    createdAt: new Date('2026-04-09T00:13:00.000Z'),
    metadata: { postId: 'post-draft-1' },
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    recipientId: 'admin_user',
    type: NotificationType.NEW_COMMENT,
    title: 'New Comment',
    message: 'reader_user commented on your post "Published Article"',
    link: 'published-article',
    isRead: false,
    createdAt: new Date('2026-04-09T00:14:00.000Z'),
    metadata: { postId: 'post-accepted-1' },
  },
];

async function clearDatabase(dataSource: DataSource): Promise<void> {
  await dataSource.query('PRAGMA foreign_keys = OFF');
  await dataSource.query('DELETE FROM posts_tags');
  await dataSource.query('DELETE FROM notifications');
  await dataSource.query('DELETE FROM comments');
  await dataSource.query('DELETE FROM subscriptions');
  await dataSource.query('DELETE FROM posts');
  await dataSource.query('DELETE FROM tags');
  await dataSource.query('DELETE FROM users');
  await dataSource.query('PRAGMA foreign_keys = ON');
}

async function seed() {
  mkdirSync(path.dirname(databasePath), { recursive: true });

  const dataSource = new DataSource({
    type: 'sqlite',
    database: databasePath,
    entities: [
      SQLitePostEntity,
      SQLiteUserEntity,
      SQLiteTagEntity,
      SQLiteCommentEntity,
      SQLiteSubscriptionEntity,
      SQLiteNotificationEntity,
    ],
    synchronize: true,
  });

  await dataSource.initialize();
  await clearDatabase(dataSource);

  const userRepository = dataSource.getRepository(SQLiteUserEntity);
  const tagRepository = dataSource.getRepository(SQLiteTagEntity);
  const postRepository = dataSource.getRepository(SQLitePostEntity);
  const commentRepository = dataSource.getRepository(SQLiteCommentEntity);
  const subscriptionRepository = dataSource.getRepository(SQLiteSubscriptionEntity);
  const notificationRepository = dataSource.getRepository(SQLiteNotificationEntity);

  await userRepository.save(seedUsers);

  const savedTags = await tagRepository.save(seedTags);
  const tagById = new Map(savedTags.map((tag) => [tag.id, tag]));

  await postRepository.save(
    seedPosts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      status: post.status,
      authorId: post.authorId,
      tags: post.tagIds.map((tagId) => tagById.get(tagId)!),
    })),
  );

  await commentRepository.save(seedComments);
  await subscriptionRepository.save(seedSubscriptions);
  await notificationRepository.save(seedNotifications);

  await dataSource.destroy();
}

seed().catch((error) => {
  console.error('Seeding failed');
  console.error(error);
  process.exitCode = 1;
});