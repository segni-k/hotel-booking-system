<?php

namespace App\Filament\Resources;

use App\Filament\Resources\BookingResource\Pages;
use App\Models\Booking;
use Filament\Forms;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;

class BookingResource extends Resource
{
    protected static ?string $model = Booking::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-calendar';

    protected static ?int $navigationSort = 3;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Forms\Components\Section::make('Booking Information')
                    ->schema([
                        Forms\Components\TextInput::make('booking_number')
                            ->disabled()
                            ->dehydrated(false),
                        Forms\Components\Select::make('user_id')
                            ->relationship('user', 'email')
                            ->required()
                            ->searchable(),
                        Forms\Components\Select::make('hotel_id')
                            ->relationship('hotel', 'name')
                            ->required()
                            ->searchable()
                            ->live(),
                        Forms\Components\Select::make('room_type_id')
                            ->relationship('roomType', 'name')
                            ->required()
                            ->searchable(),
                        Forms\Components\Select::make('status')
                            ->options([
                                'pending' => 'Pending',
                                'confirmed' => 'Confirmed',
                                'checked_in' => 'Checked In',
                                'checked_out' => 'Checked Out',
                                'cancelled' => 'Cancelled',
                                'no_show' => 'No Show',
                            ])
                            ->required(),
                    ])->columns(2),

                Forms\Components\Section::make('Stay Details')
                    ->schema([
                        Forms\Components\DatePicker::make('check_in_date')
                            ->required()
                            ->native(false),
                        Forms\Components\DatePicker::make('check_out_date')
                            ->required()
                            ->native(false),
                        Forms\Components\TextInput::make('number_of_adults')
                            ->required()
                            ->numeric()
                            ->default(1),
                        Forms\Components\TextInput::make('number_of_children')
                            ->numeric()
                            ->default(0),
                    ])->columns(2),

                Forms\Components\Section::make('Payment Details')
                    ->schema([
                        Forms\Components\TextInput::make('total_amount')
                            ->required()
                            ->numeric()
                            ->prefix('ETB'),
                        Forms\Components\Select::make('payment_method')
                            ->options([
                                'pay_now' => 'Pay Now',
                                'pay_at_hotel' => 'Pay at Hotel',
                            ])
                            ->required(),
                        Forms\Components\Textarea::make('special_requests')
                            ->rows(3)
                            ->columnSpanFull(),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('booking_number')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('user.email')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('hotel.name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('roomType.name')
                    ->label('Room Type'),
                Tables\Columns\TextColumn::make('check_in_date')
                    ->date()
                    ->sortable(),
                Tables\Columns\TextColumn::make('check_out_date')
                    ->date()
                    ->sortable(),
                Tables\Columns\TextColumn::make('total_amount')
                    ->money('ETB')
                    ->sortable(),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'warning',
                        'confirmed' => 'success',
                        'checked_in' => 'primary',
                        'checked_out' => 'success',
                        'cancelled' => 'danger',
                        'no_show' => 'danger',
                        default => 'gray',
                    })
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'confirmed' => 'Confirmed',
                        'checked_in' => 'Checked In',
                        'checked_out' => 'Checked Out',
                        'cancelled' => 'Cancelled',
                        'no_show' => 'No Show',
                    ]),
                Tables\Filters\SelectFilter::make('hotel')
                    ->relationship('hotel', 'name'),
                Tables\Filters\Filter::make('check_in_date')
                    ->form([
                        Forms\Components\DatePicker::make('from'),
                        Forms\Components\DatePicker::make('until'),
                    ])
                    ->query(function ($query, array $data) {
                        return $query
                            ->when($data['from'], fn($q, $date) => $q->whereDate('check_in_date', '>=', $date))
                            ->when($data['until'], fn($q, $date) => $q->whereDate('check_in_date', '<=', $date));
                    }),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\Action::make('check_in')
                    ->icon('heroicon-o-arrow-right-on-rectangle')
                    ->color('success')
                    ->action(fn(Booking $record) => $record->update(['status' => 'checked_in', 'checked_in_at' => now()]))
                    ->requiresConfirmation()
                    ->visible(fn(Booking $record) => $record->status === 'confirmed'),
                Tables\Actions\Action::make('check_out')
                    ->icon('heroicon-o-arrow-left-on-rectangle')
                    ->color('warning')
                    ->action(fn(Booking $record) => $record->update(['status' => 'checked_out', 'checked_out_at' => now()]))
                    ->requiresConfirmation()
                    ->visible(fn(Booking $record) => $record->status === 'checked_in'),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListBookings::route('/'),
            'create' => Pages\CreateBooking::route('/create'),
            'edit' => Pages\EditBooking::route('/{record}/edit'),
        ];
    }
}
