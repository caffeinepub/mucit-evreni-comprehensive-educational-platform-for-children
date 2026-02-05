import Map "mo:core/Map";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import Array "mo:core/Array";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Nat "mo:core/Nat";
import Option "mo:core/Option";

actor {
  include MixinStorage();

  // ============================================================================
  // ADMIN PROFILE SYSTEM (Role-based access control for project contributors)
  // ============================================================================

  let accessControlState = AccessControl.initState();

  type AdminProfile = {
    name : Text;
  };

  let adminProfiles = Map.empty<Principal, AdminProfile>();

  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?AdminProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Yetkisiz işlem: Yalnızca yöneticiler profil görüntüleyebilir.");
    };
    adminProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?AdminProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Yetkisiz işlem: Yalnızca kendi profilinizi görüntüleyebilirsiniz.");
    };
    adminProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : AdminProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Yetkisiz işlem: Yalnızca yöneticiler profil kaydedebilir.");
    };
    adminProfiles.add(caller, profile);
  };

  public query ({ caller }) func canUploadContent() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  // ============================================================================
  // AUDIO STORAGE SYSTEM (MP3 speech bubbles & sound effect database)
  // ============================================================================

  type AudioFile = {
    id : Nat;
    file : Storage.ExternalBlob;
    audioLabel : Text;
    uploadedAt : Int;
  };

  type AudioFileNoFile = {
    id : Nat;
    audioLabel : Text;
    uploadedAt : Int;
  };

  type AudioFileList = {
    audioFiles : [AudioFileNoFile];
  };

  let audioFiles = Map.empty<Nat, AudioFile>();
  var lastAudioId = 0;

  public shared ({ caller }) func uploadAudio(audioLabel : Text, blob : Storage.ExternalBlob) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Yetkisiz işlem: Yalnızca yöneticiler ses ekleyebilir.");
    };
    let audioFile = {
      id = lastAudioId + 1;
      file = blob;
      audioLabel;
      uploadedAt = Time.now();
    };
    audioFiles.add(audioFile.id, audioFile);
    lastAudioId += 1;
    audioFile.id;
  };

  public query func getAudioFile(id : Nat) : async ?AudioFile {
    audioFiles.get(id);
  };

  public query func listAudioFiles() : async AudioFileList {
    let audioFilesArray = audioFiles.values().toArray();
    let audioFilesWithoutFile = audioFilesArray.map(
      func(audioFile) {
        {
          id = audioFile.id;
          audioLabel = audioFile.audioLabel;
          uploadedAt = audioFile.uploadedAt;
        };
      }
    );
    { audioFiles = audioFilesWithoutFile };
  };

  public query func listAllAudioFilesWithFiles() : async [AudioFile] {
    audioFiles.values().toArray();
  };

  public shared ({ caller }) func deleteAudio(id : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Yetkisiz işlem: Yalnızca yöneticiler ses silebilir.");
    };
    audioFiles.remove(id);
  };

  // ============================================================================
  // SOUND SYSTEM (Categorized sound effects, narrations and music)
  // ============================================================================

  public type SoundCategory = {
    #dogruCevap;
    #yanlisCevap;
    #secim;
    #basari;
    #uyari;
    #gecisSesi;
    #arkaPlanMuzigi;
    #anlaticiHosgeldiniz;
    #anlaticiGorevBaslangici;
    #anlaticiBasari;
    #anlaticiHataTekrarDene;
    #anlaticiBolumGecisi;
    #anlaticiMotivasyon;
  };

  public type Sound = {
    category : SoundCategory;
    file : Storage.ExternalBlob;
    uploadedAt : Int;
  };

  let sounds = Map.empty<Text, Sound>();

  func categoryToText(category : SoundCategory) : Text {
    switch (category) {
      case (#dogruCevap) { "dogruCevap" };
      case (#yanlisCevap) { "yanlisCevap" };
      case (#secim) { "secim" };
      case (#basari) { "basari" };
      case (#uyari) { "uyari" };
      case (#gecisSesi) { "gecisSesi" };
      case (#arkaPlanMuzigi) { "arkaPlanMuzigi" };
      case (#anlaticiHosgeldiniz) { "anlaticiHosgeldiniz" };
      case (#anlaticiGorevBaslangici) { "anlaticiGorevBaslangici" };
      case (#anlaticiBasari) { "anlaticiBasari" };
      case (#anlaticiHataTekrarDene) { "anlaticiHataTekrarDene" };
      case (#anlaticiBolumGecisi) { "anlaticiBolumGecisi" };
      case (#anlaticiMotivasyon) { "anlaticiMotivasyon" };
    };
  };

  func isValidMp3Url(url : Text) : Bool {
    url.endsWith(#text ".mp3");
  };

  public shared ({ caller }) func uploadSound(
    category : SoundCategory,
    fileOrUrl : { #file : Storage.ExternalBlob; #url : Text },
  ) : async Text {
    let unauthorizedError = "Yetkisiz işlem: Yalnızca yöneticiler ses ekleyebilir.";
    let downloadFailedError = "Ses indirilemedi, lütfen geçerli bir MP3 bağlantısı girin.";

    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap(unauthorizedError);
    };

    switch (fileOrUrl) {
      case (#file(blob)) {
        let newSound : Sound = {
          category;
          file = blob;
          uploadedAt = Time.now();
        };
        sounds.add(
          categoryToText(category),
          newSound,
        );
        "Dosya başarıyla yüklendi";
      };
      case (#url(_url)) {
        Runtime.trap(downloadFailedError);
      };
    };
  };

  public query func getSound(category : SoundCategory) : async ?Sound {
    sounds.get(categoryToText(category));
  };

  public query func listSounds() : async [Sound] {
    sounds.values().toArray();
  };

  // ============================================================================
  // STUDENT DATA SYSTEM (Device-based, no authentication required)
  // ============================================================================

  // Student profile data
  public type StudentProfile = {
    studentNumber : Text; // 16-digit unique identifier
    username : Text;
    avatar : Text;
    notificationEnabled : Bool;
    soundEnabled : Bool;
    createdAt : Int;
    lastUpdated : Int;
  };

  // Personal notes
  public type Note = {
    id : Nat;
    title : Text;
    content : Text;
    createdAt : Int;
    updatedAt : Int;
  };

  // Daily plans
  public type DailyPlan = {
    id : Nat;
    date : Text; // ISO date string
    activities : [Text];
    goals : [Text];
    createdAt : Int;
    updatedAt : Int;
  };

  // Exam results
  public type ExamResult = {
    id : Nat;
    date : Text;
    educationLevel : Text;
    score : Nat;
    totalQuestions : Nat;
    completedAt : Int;
  };

  // Progress tracking
  public type ProgressData = {
    totalScore : Nat;
    achievementBadge : Text;
    progressPercentage : Nat;
    completedActivities : [Text];
    lastActivityDate : Int;
  };

  // Complete student data
  public type StudentData = {
    profile : StudentProfile;
    notes : [Note];
    dailyPlans : [DailyPlan];
    examResults : [ExamResult];
    progress : ProgressData;
  };

  // Storage maps
  let studentProfiles = Map.empty<Text, StudentProfile>();
  let studentNotes = Map.empty<Text, [Note]>();
  let studentPlans = Map.empty<Text, [DailyPlan]>();
  let studentExams = Map.empty<Text, [ExamResult]>();
  let studentProgress = Map.empty<Text, ProgressData>();

  // Counters for IDs
  let noteCounters = Map.empty<Text, Nat>();
  let planCounters = Map.empty<Text, Nat>();
  let examCounters = Map.empty<Text, Nat>();

  // Helper: Validate student number format (16 digits)
  func isValidStudentNumber(studentNumber : Text) : Bool {
    if (studentNumber.size() != 16) {
      return false;
    };
    for (char in studentNumber.chars()) {
      if (char < '0' or char > '9') {
        return false;
      };
    };
    true;
  };

  // Helper: Sanitize student number (remove spaces)
  func sanitizeStudentNumber(studentNumber : Text) : Text {
    studentNumber.replace(#text " ", "");
  };

  // ============================================================================
  // STUDENT PROFILE OPERATIONS (Public - no auth required)
  // ============================================================================

  // Save or update student profile
  public func saveStudentProfile(profile : StudentProfile) : async () {
    let sanitized = sanitizeStudentNumber(profile.studentNumber);
    if (not isValidStudentNumber(sanitized)) {
      Runtime.trap("Geçersiz öğrenci numarası formatı. 16 haneli sayı olmalıdır.");
    };

    let updatedProfile = {
      profile with
      studentNumber = sanitized;
      lastUpdated = Time.now();
    };

    studentProfiles.add(sanitized, updatedProfile);
  };

  // Get student profile by student number
  public query func getStudentProfile(studentNumber : Text) : async ?StudentProfile {
    let sanitized = sanitizeStudentNumber(studentNumber);
    studentProfiles.get(sanitized);
  };

  // Delete student profile (for profile reset)
  public func deleteStudentProfile(studentNumber : Text) : async () {
    let sanitized = sanitizeStudentNumber(studentNumber);
    if (not isValidStudentNumber(sanitized)) {
      Runtime.trap("Geçersiz öğrenci numarası formatı.");
    };

    // Remove all student data
    studentProfiles.remove(sanitized);
    studentNotes.remove(sanitized);
    studentPlans.remove(sanitized);
    studentExams.remove(sanitized);
    studentProgress.remove(sanitized);
    noteCounters.remove(sanitized);
    planCounters.remove(sanitized);
    examCounters.remove(sanitized);
  };

  // ============================================================================
  // NOTES OPERATIONS (Public - no auth required)
  // ============================================================================

  public func saveNote(studentNumber : Text, note : Note) : async Nat {
    let sanitized = sanitizeStudentNumber(studentNumber);
    if (not isValidStudentNumber(sanitized)) {
      Runtime.trap("Geçersiz öğrenci numarası formatı.");
    };

    let counter = noteCounters.get(sanitized).get(0);
    let newId = counter + 1;
    noteCounters.add(sanitized, newId);

    let newNote = {
      note with
      id = newId;
      updatedAt = Time.now();
    };

    let existingNotes = studentNotes.get(sanitized).get([]);
    let updatedNotes = existingNotes.concat([newNote]);
    studentNotes.add(sanitized, updatedNotes);

    newId;
  };

  public func updateNote(studentNumber : Text, noteId : Nat, updatedNote : Note) : async () {
    let sanitized = sanitizeStudentNumber(studentNumber);
    if (not isValidStudentNumber(sanitized)) {
      Runtime.trap("Geçersiz öğrenci numarası formatı.");
    };

    let existingNotes = studentNotes.get(sanitized).get([]);
    let updatedNotes = existingNotes.map(
      func(n) {
        if (n.id == noteId) {
          { updatedNote with id = noteId; updatedAt = Time.now() };
        } else {
          n;
        };
      },
    );
    studentNotes.add(sanitized, updatedNotes);
  };

  public func deleteNote(studentNumber : Text, noteId : Nat) : async () {
    let sanitized = sanitizeStudentNumber(studentNumber);
    if (not isValidStudentNumber(sanitized)) {
      Runtime.trap("Geçersiz öğrenci numarası formatı.");
    };

    let existingNotes = studentNotes.get(sanitized).get([]);
    let filteredNotes = existingNotes.filter(func(n) { n.id != noteId });
    studentNotes.add(sanitized, filteredNotes);
  };

  public query func getNotes(studentNumber : Text) : async [Note] {
    let sanitized = sanitizeStudentNumber(studentNumber);
    studentNotes.get(sanitized).get([]);
  };

  // ============================================================================
  // DAILY PLANS OPERATIONS (Public - no auth required)
  // ============================================================================

  public func saveDailyPlan(studentNumber : Text, plan : DailyPlan) : async Nat {
    let sanitized = sanitizeStudentNumber(studentNumber);
    if (not isValidStudentNumber(sanitized)) {
      Runtime.trap("Geçersiz öğrenci numarası formatı.");
    };

    let counter = planCounters.get(sanitized).get(0);
    let newId = counter + 1;
    planCounters.add(sanitized, newId);

    let newPlan = {
      plan with
      id = newId;
      updatedAt = Time.now();
    };

    let existingPlans = studentPlans.get(sanitized).get([]);
    let updatedPlans = existingPlans.concat([newPlan]);
    studentPlans.add(sanitized, updatedPlans);

    newId;
  };

  public func updateDailyPlan(studentNumber : Text, planId : Nat, updatedPlan : DailyPlan) : async () {
    let sanitized = sanitizeStudentNumber(studentNumber);
    if (not isValidStudentNumber(sanitized)) {
      Runtime.trap("Geçersiz öğrenci numarası formatı.");
    };

    let existingPlans = studentPlans.get(sanitized).get([]);
    let updatedPlans = existingPlans.map(
      func(p) {
        if (p.id == planId) {
          { updatedPlan with id = planId; updatedAt = Time.now() };
        } else {
          p;
        };
      },
    );
    studentPlans.add(sanitized, updatedPlans);
  };

  public func deleteDailyPlan(studentNumber : Text, planId : Nat) : async () {
    let sanitized = sanitizeStudentNumber(studentNumber);
    if (not isValidStudentNumber(sanitized)) {
      Runtime.trap("Geçersiz öğrenci numarası formatı.");
    };

    let existingPlans = studentPlans.get(sanitized).get([]);
    let filteredPlans = existingPlans.filter(func(p) { p.id != planId });
    studentPlans.add(sanitized, filteredPlans);
  };

  public query func getDailyPlans(studentNumber : Text) : async [DailyPlan] {
    let sanitized = sanitizeStudentNumber(studentNumber);
    studentPlans.get(sanitized).get([]);
  };

  // ============================================================================
  // EXAM RESULTS OPERATIONS (Public - no auth required)
  // ============================================================================

  public func saveExamResult(studentNumber : Text, exam : ExamResult) : async Nat {
    let sanitized = sanitizeStudentNumber(studentNumber);
    if (not isValidStudentNumber(sanitized)) {
      Runtime.trap("Geçersiz öğrenci numarası formatı.");
    };

    let counter = examCounters.get(sanitized).get(0);
    let newId = counter + 1;
    examCounters.add(sanitized, newId);

    let newExam = {
      exam with
      id = newId;
      completedAt = Time.now();
    };

    let existingExams = studentExams.get(sanitized).get([]);
    let updatedExams = existingExams.concat([newExam]);
    studentExams.add(sanitized, updatedExams);

    newId;
  };

  public query func getExamResults(studentNumber : Text) : async [ExamResult] {
    let sanitized = sanitizeStudentNumber(studentNumber);
    studentExams.get(sanitized).get([]);
  };

  // ============================================================================
  // PROGRESS TRACKING OPERATIONS (Public - no auth required)
  // ============================================================================

  public func saveProgress(studentNumber : Text, progress : ProgressData) : async () {
    let sanitized = sanitizeStudentNumber(studentNumber);
    if (not isValidStudentNumber(sanitized)) {
      Runtime.trap("Geçersiz öğrenci numarası formatı.");
    };

    let updatedProgress = {
      progress with
      lastActivityDate = Time.now();
    };

    studentProgress.add(sanitized, updatedProgress);
  };

  public query func getProgress(studentNumber : Text) : async ?ProgressData {
    let sanitized = sanitizeStudentNumber(studentNumber);
    studentProgress.get(sanitized);
  };

  // ============================================================================
  // PARENT-TEACHER QUERY OPERATIONS (Public read-only access)
  // ============================================================================

  // Get complete student data for parent-teacher viewing
  public query func getStudentData(studentNumber : Text) : async ?StudentData {
    let sanitized = sanitizeStudentNumber(studentNumber);

    switch (studentProfiles.get(sanitized)) {
      case null { null };
      case (?profile) {
        let notes = studentNotes.get(sanitized).get([]);
        let plans = studentPlans.get(sanitized).get([]);
        let exams = studentExams.get(sanitized).get([]);
        let progress = studentProgress.get(sanitized).get(
          {
            totalScore = 0;
            achievementBadge = "Acemi";
            progressPercentage = 0;
            completedActivities = [];
            lastActivityDate = 0;
          },
        );

        ?{
          profile;
          notes;
          dailyPlans = plans;
          examResults = exams;
          progress;
        };
      };
    };
  };

  // Batch sync operation for offline-online synchronization
  public func syncStudentData(studentNumber : Text, data : StudentData) : async () {
    let sanitized = sanitizeStudentNumber(studentNumber);
    if (not isValidStudentNumber(sanitized)) {
      Runtime.trap("Geçersiz öğrenci numarası formatı.");
    };

    // Update profile
    studentProfiles.add(sanitized, data.profile);

    // Update notes
    studentNotes.add(sanitized, data.notes);
    if (data.notes.size() > 0) {
      let maxNoteId = data.notes.foldLeft(
        0,
        func(max, note) { if (note.id > max) { note.id } else { max } },
      );
      noteCounters.add(sanitized, maxNoteId);
    };

    // Update plans
    studentPlans.add(sanitized, data.dailyPlans);
    if (data.dailyPlans.size() > 0) {
      let maxPlanId = data.dailyPlans.foldLeft(
        0,
        func(max, plan) { if (plan.id > max) { plan.id } else { max } },
      );
      planCounters.add(sanitized, maxPlanId);
    };

    // Update exams
    studentExams.add(sanitized, data.examResults);
    if (data.examResults.size() > 0) {
      let maxExamId = data.examResults.foldLeft(
        0,
        func(max, exam) { if (exam.id > max) { exam.id } else { max } },
      );
      examCounters.add(sanitized, maxExamId);
    };

    // Update progress
    studentProgress.add(sanitized, data.progress);
  };
};

