import { v4 } from 'uuid';
import { PostContent } from '../value-objects/post-content.value-object';
import { PostTitle } from '../value-objects/post-title.value-object';
import { TagEntity } from 'src/modules/tags/domain/entities/tag.entity';
import { PostSlug } from '../value-objects/post-slug.value-object';

export type PostStatus = 'draft' | 'waiting' | 'accepted' | 'rejected';

export class PostEntity {
  private _title: PostTitle;
  private _content: PostContent;
  private _authorId: string;
  private _status: PostStatus;
  private _tags: TagEntity[] = [];
  private _slug: PostSlug;

  private constructor(
    readonly id: string,
    title: PostTitle,
    content: PostContent,
    authorId: string,
    status: PostStatus,
    tags: TagEntity[] = [],
    slug: PostSlug,
  ) {
    this._title = title;
    this._content = content;
    this._authorId = authorId;
    this._status = status;
    this._slug = slug;
    this._tags = tags;
  }

  public get status() {
    return this._status;
  }

  public get authorId() {
    return this._authorId;
  }

  public get slug() {
    return this._slug.toString();
  }

  public updateSlug(newSlug: string): void {
    this._slug = PostSlug.create(newSlug);
  }

  public get tags() {
    return this._tags;
  }

  public addTag(tag: TagEntity) {
    if (!this._tags.find(t => t.id === tag.id)) {
      this._tags.push(tag);
    }
  }

  public removeTag(tagId: string) {
    this._tags = this._tags.filter(t => t.id !== tagId);
  }

  public static reconstitute(input: Record<string, unknown>) {
    return new PostEntity(
      input.id as string,
      new PostTitle(input.title as string),
      new PostContent(input.content as string),
      input.authorId as string,
      input.status as PostStatus,
      input.tags ? (input.tags as Record<string, unknown>[]).map(tag => TagEntity.reconstitute(tag)) : [],
      PostSlug.create(input.slug as string)
    );
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      title: this._title.toString(),
      content: this._content.toString(),
      status: this._status,
      authorId: this._authorId,
      slug: this._slug.toString(),
      tags: this._tags.map(tag => tag.toJSON()),
    };
  }

  public static create(
    title: string,
    content: string,
    authorId: string,
    manuallySetSlug?: string
  ): PostEntity {
    const slugValue = manuallySetSlug || PostSlug.fromTitle(title);
    return new PostEntity(
      v4(),
      new PostTitle(title),
      new PostContent(content),
      authorId,
      'draft',
      [],
      PostSlug.create(slugValue),
    );
  }

  public update(title?: string, content?: string) {
    if (title) {
      this._title = new PostTitle(title);
    }

    if (content) {
      this._content = new PostContent(content);
    }
  }
}
