import { DatePipe, NgFor } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Comment } from '../models/Comment';
import { AppMaterialModule } from '../app-material/app-material.module';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommentService } from '../services/comment.service';
import { Program } from '../models/Program';

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [NgFor, AppMaterialModule, ReactiveFormsModule, DatePipe],
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.css',
})
export class CommentListComponent implements OnInit {
  @Input() program: Program | undefined;
  comments: Comment[] = [];
  commentForm!: FormGroup;

  constructor(private fb: FormBuilder, private commentService: CommentService) {
    this.commentForm = this.fb.group({
      comment: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.loadComments();
  }

  loadComments() {
    const programId = this.program?.id ?? 0;
    this.commentService.getCommentsByProgram(programId).subscribe((data) => {
      this.comments = data;
    });
  }

  submitComment() {
    const programId = this.program?.id ?? 0;
    const content = this.commentForm.get('comment')?.value;

    this.commentService.createComment(43, programId, content).subscribe(() => {
      this.loadComments();
      this.commentForm.reset();
    });
  }

  deleteComment(commentId: number) {
    this.commentService.deleteComment(commentId).subscribe(() => {
      this.loadComments();
    });
  }
}
