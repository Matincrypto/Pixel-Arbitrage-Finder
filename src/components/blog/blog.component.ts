
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { GeminiService, BlogPost } from '../../services/gemini.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogComponent implements OnInit {
  private geminiService = inject(GeminiService);

  isLoading = signal(true);
  blogPost = signal<BlogPost | null>(null);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.fetchNewPost();
  }

  async fetchNewPost(): Promise<void> {
    this.isLoading.set(true);
    this.blogPost.set(null);
    this.error.set(null);

    try {
      // Step 1: Generate the blog content
      const postContent = await this.geminiService.generateBlogPost();

      // Step 2: Generate the image for the blog post
      const imageUrl = await this.geminiService.generateImage(postContent.imagePrompt, '16:9');

      // Step 3: Combine and set the final blog post
      this.blogPost.set({ ...postContent, image: imageUrl });

    } catch (e: any) {
      this.error.set(e.message || 'An unknown error occurred while fetching the blog post.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
