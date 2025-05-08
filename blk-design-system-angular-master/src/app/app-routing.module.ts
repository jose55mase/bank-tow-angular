import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";

import { IndexComponent } from "./pages/index/index.component";
import { ProfilepageComponent } from "./pages/examples/profilepage/profilepage.component";
import { RegisterpageComponent } from "./pages/examples/registerpage/registerpage.component";
import { LandingpageComponent } from "./pages/examples/landingpage/landingpage.component";
import { HomePage } from "./pages/help/help.component";
import { CommentsPage } from "./pages/comments/comment.component";
import { UserPage } from "./pages/user/user.component";
import { TransactionPage } from "./pages/transaction/transaction.component";
import { AuthGuard } from "./core/guards/auth.guard";
import { FilesComponent } from "./pages/files/files.component";
import { FilesAdminComponent } from "./pages/file_admin/files_admin.component";

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: IndexComponent },
  { path: "help", component: HomePage },
  { path: "comments", component: CommentsPage },
  { path: "users", component: UserPage , canActivate: [AuthGuard]},
  { path: "profile", component: ProfilepageComponent, canActivate: [AuthGuard] },
  { path: "register", component: RegisterpageComponent },
  { path: "transaction", component: TransactionPage, canActivate: [AuthGuard] },
  { path: "landing", component: LandingpageComponent, canActivate: [AuthGuard] },
  { path: "files", component: FilesComponent, canActivate: [AuthGuard] },
  { path: "filesAdmin", component: FilesAdminComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: []
})
export class AppRoutingModule {}
