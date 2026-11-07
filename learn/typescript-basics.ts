// Run with: npm run learn:ts
// Node can run this .ts file directly: it strips the types out and runs the JavaScript left over.
// Note: Node only strips types; it does not check them. The red underlines in VS Code
// (and `nest build`) do the checking.

// 1. Basic type annotations
const blogName: string = 'My Blog';
let postCount: number = 0;
const isLive: boolean = true;

// 2. An interface describes the shape of an object. `?` means optional.
interface Post {
  id: number;
  title: string;
  author: string;
  published?: boolean;
}

// 3. A union type: status can ONLY be one of these two strings.
type Status = 'draft' | 'published';

// 4. A function with typed parameters and a typed return value.
function statusOf(post: Post): Status {
  return post.published ? 'published' : 'draft';
}

// 5. A generic: <T> means "works for any type, and keeps track of which one".
function firstOrUndefined<T>(items: T[]): T | undefined {
  return items[0];
}

// 6. A class with access modifiers, like the services Nest uses.
class PostStore {
  private posts: Post[] = []; // `private`: code outside this class cannot touch it

  add(title: string, author: string): Post {
    const post: Post = { id: this.posts.length + 1, title, author };
    this.posts.push(post);
    return post;
  }

  findById(id: number): Post | undefined {
    return this.posts.find((p) => p.id === id);
  }

  count(): number {
    return this.posts.length;
  }
}

const store = new PostStore();
store.add('Hello TypeScript', 'Ada');
store.add('Types are erased at runtime', 'Ada');
postCount = store.count();

const found = store.findById(1);
// `found` might be undefined, so TypeScript makes us check before using it.
if (found) {
  console.log(`${blogName} (live: ${isLive}): "${found.title}" is a ${statusOf(found)}`);
}
console.log('Post count:', postCount);
console.log('First number:', firstOrUndefined([10, 20, 30]));

// ---- EXERCISE: uncomment each line below and read the red underline in VS Code ----
// store.findById('1');                  // Class 1's bug: a string where a number is expected
// const s: Status = 'deleted';          // not one of the allowed union values
// store.posts = [];                     // posts is private
// console.log(found.title);             // found might be undefined (outside the if)
// store.add('Missing an author');       // wrong number of arguments
